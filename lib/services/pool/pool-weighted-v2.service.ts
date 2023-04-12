import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinProcessedStepsOutput,
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BaseProvider } from '@ethersproject/providers';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import {
    poolGetPoolTokenForPossiblyNestedTokenOut,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetNestedTokenEstimateForPoolTokenAmounts,
    calculateBptOut,
    getBptOutForToken,
} from '~/lib/services/pool/lib/util';
import { PoolComposableJoinService } from '~/lib/services/pool/lib/pool-composable-join.service';
import { PoolComposableExitService } from '~/lib/services/pool/lib/pool-composable-exit.service';
import { sortBy } from 'lodash';
import { parseUnits } from 'ethers/lib/utils.js';
import { oldBnum, oldBnumFromBnum } from '~/lib/services/pool/lib/old-big-number';
import { formatFixed } from '@ethersproject/bignumber';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';

export class PoolWeightedV2Service implements PoolService {
    private readonly composableJoinService: PoolComposableJoinService;
    private readonly composableExitService: PoolComposableExitService;

    constructor(
        private pool: GqlPoolWeighted,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
        private readonly provider: BaseProvider,
    ) {
        this.composableJoinService = new PoolComposableJoinService(pool, batchRelayerService, provider, wethAddress);
        this.composableExitService = new PoolComposableExitService(pool, batchRelayerService, provider, wethAddress);
    }

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
        this.composableJoinService.updatePool(pool);
    }

    public async joinGetProportionalSuggestion(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can use that as the base to calculate the proportions of the other tokens
        const smallestBptOutAmount = sortBy(
            this.pool.tokens.map((token) => {
                if (token.__typename === 'GqlPoolTokenPhantomStable') {
                    // another loop to find the smallest bptOut amount for the nested stable pool
                    const nestedTokens = token.pool.tokens.map((poolToken) =>
                        getBptOutForToken(userInvestTokenBalances, poolToken, token.pool.totalShares),
                    );

                    const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOut');

                    console.log({ smallestNestedBptOutAmountArray });

                    // calculate the proportional amounts => current token amount * current token priceRate * ( current token weight / smallest bpt token weight)
                    // and sum them to get the 'amountIn' for the nested stable pool bptOut calculation
                    const amount = formatFixed(
                        smallestNestedBptOutAmountArray
                            .map((nestedToken) =>
                                oldBnumFromBnum(parseUnits(nestedToken.token.amount || '', nestedToken.decimals))
                                    .times(nestedToken.priceRate)
                                    .times(nestedToken.weight / smallestNestedBptOutAmountArray[0].weight)
                                    .toFixed(0),
                            )
                            .reduce((total, token) => total.plus(token), oldBnum(0))
                            .toString(),
                        18,
                    ).toString();

                    console.log({ amount });

                    return {
                        bptOut: calculateBptOut(this.pool.dynamicData.totalShares, amount, token.balance),
                        token: {
                            address: smallestNestedBptOutAmountArray[0].token.address,
                            amount,
                        },
                    };
                } else {
                    // the function will take care of either 'GqlPoolToken' or 'GqlPoolTokenLinear'
                    return getBptOutForToken(userInvestTokenBalances, token, this.pool.dynamicData.totalShares);
                }
            }),
            'bptOut',
        )[0];

        const fixedAmount = {
            ...smallestBptOutAmount.token,
            address: replaceEthWithWeth(smallestBptOutAmount.token.address || ''),
        };

        const result = await this.joinGetProportionalSuggestionForFixedAmount(
            fixedAmount,
            userInvestTokenBalances.map((token) => replaceEthWithWeth(token.address)),
        );

        return result;
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        if (parseFloat(fixedAmount.amount) === 0) {
            return tokensIn.map((address) => ({ address, amount: '0.0' }));
        }

        //map fixedAmount to the corresponding BPT
        const poolToken = poolGetPoolTokenForPossiblyNestedTokenOut(this.pool, fixedAmount.address);
        const { processedSteps } = await this.composableJoinService.processJoinSteps({
            tokenAmountsIn: [fixedAmount],
            slippage: '0',
        });
        const joinStep = processedSteps.find((step) => step.type === 'Join' && step.pool.id === this.pool.id)!;
        const poolTokenFixedAmount = joinStep.tokenAmountsIn.find(
            (amountIn) => amountIn.address === poolToken?.address,
        );

        if (!poolTokenFixedAmount) {
            throw new Error('WeightedV2: failed to map fixed amount to pool token fixed amount');
        }

        //get the corresponding pool token amounts
        const proportionalSuggestion = poolGetProportionalJoinAmountsForFixedAmount(
            poolTokenFixedAmount,
            this.pool.tokens,
        );

        //map pool token amounts to invest token amounts
        return poolGetNestedTokenEstimateForPoolTokenAmounts({
            pool: this.pool,
            nestedTokens: tokensIn,
            poolTokenAmounts: proportionalSuggestion,
        });
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const { processedSteps } = await this.getJoinData(data.tokenAmountsIn, data.slippage);

        return this.composableJoinService.joinGetContractCallData({
            data,
            processedSteps,
        });
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { priceImpact, minBptReceived, nestedPriceImpacts } = await this.getJoinData(tokenAmountsIn, slippage);

        return {
            priceImpact,
            minBptReceived,
            nestedPriceImpacts,
        };
    }

    private async getJoinData(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<ComposablePoolJoinProcessedStepsOutput> {
        const data = await this.composableJoinService.processJoinSteps({
            tokenAmountsIn,
            slippage,
        });

        //TODO: cache data while tokenAmountsIn and slippage are constant
        return data;
    }

    public async exitGetProportionalPoolTokenWithdrawEstimate(
        bptIn: AmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return this.composableExitService.exitGetProportionalPoolTokenWithdrawEstimate(bptIn);
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return this.composableExitService.exitGetProportionalWithdrawEstimate(bptIn, tokensOut);
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        return this.composableExitService.exitGetBptInForSingleAssetWithdraw(tokenAmount);
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        return this.composableExitService.exitGetSingleAssetWithdrawForBptIn(bptIn, tokenOutAddress);
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        if (data.kind === 'ExactBPTInForTokensOut') {
            return this.composableExitService.exitExactBPTInForTokensOutGetContractCallData(data);
        } else if (data.kind === 'ExactBPTInForOneTokenOut') {
            return this.composableExitService.exitExactBPTInForOneTokenOutGetContractCallData(data);
        }

        throw new Error('unsupported join type');
    }
}
