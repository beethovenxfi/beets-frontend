import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { PoolWeightedService } from '~/lib/services/pool/pool-weighted.service';
import { Swaps, SwapType, SwapV2, WeightedPoolEncoder } from '@balancer-labs/sdk';
import {
    poolBatchSwaps,
    poolFindPoolTokenFromOptions,
    poolGetJoinSwapForToken,
    poolQueryBatchSwap,
} from '~/lib/services/pool/pool-phantom-stable-util';
import { SwapTypes } from '@balancer-labs/sor';
import { BaseProvider } from '@ethersproject/providers';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnum, oldBnumScale } from '~/lib/services/pool/lib/old-big-number';
import { formatFixed } from '@ethersproject/bignumber';
import { MaxUint256, Zero } from '@ethersproject/constants';

export class PoolWeightedBoostedService implements PoolService {
    private baseService: PoolBaseService;
    private weightedPoolService: PoolWeightedService;

    constructor(
        private pool: GqlPoolWeighted,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
        private readonly provider: BaseProvider,
    ) {
        this.baseService = new PoolBaseService(pool, wethAddress);
        this.weightedPoolService = new PoolWeightedService(pool, batchRelayerService, wethAddress);
    }

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
        this.baseService.updatePool(pool);
        this.weightedPoolService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const calls: string[] = [];
        const tokensIn = data.tokenAmountsIn.map((tokenAmount) => tokenAmount.address);
        const ethAmount = data.wethIsEth
            ? data.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === this.wethAddress)
            : undefined;
        const ethAmountScaled = ethAmount ? parseUnits(ethAmount.amount, 18) : Zero;
        const { swaps, assets, deltas, tokenAmountsMappedToPoolTokens, tokensOut } = await this.getJoinSwaps(
            data.tokenAmountsIn,
        );

        const limits = Swaps.getLimitsForSlippage(
            tokensIn,
            tokensOut,
            SwapType.SwapExactIn,
            deltas,
            assets,
            //5%=50_000_000_000_000_000.
            `${oldBnumScale(data.slippage, 16).toFixed(0)}`,
        );

        const batchSwap = this.batchRelayerService.vaultEncodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps,
            assets,
            funds: {
                sender: data.userAddress,
                recipient: data.userAddress,
                fromInternalBalance: false,
                toInternalBalance: true,
            },
            limits: limits.map((l) => l.toString()),
            deadline: MaxUint256,
            value: ethAmountScaled.toString(),
            outputReferences: assets.map((asset, index) => ({
                index,
                key: this.batchRelayerService.toChainedReference(index),
            })),
        });

        calls.push(batchSwap);

        const joinHasNativeAsset =
            data.wethIsEth && this.pool.tokens.find((token) => token.address === this.wethAddress);

        const amountsIn = this.pool.tokens.map((token) => {
            const tokenAmountIn = data.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === token.address);

            if (tokenAmountIn) {
                return parseUnits(tokenAmountIn.amount, token.decimals).toString();
            }

            //This token is a nested BPT, not a mainToken
            //Replace the amount with the chained reference value
            const index = assets.findIndex((asset) => asset.toLowerCase() === token.address) || -1;

            //if the return amount is 0, we dont pass on the chained reference
            if (index === -1 || deltas[index] === '0') {
                return '0';
            }

            return this.batchRelayerService.toChainedReference(index);
        });

        const encodedJoinPool = this.batchRelayerService.vaultEncodeJoinPool({
            poolId: this.pool.id,
            poolKind: 0,
            sender: data.userAddress,
            recipient: data.zapIntoMasterchefFarm ? this.batchRelayerService.batchRelayerAddress : data.userAddress,
            joinPoolRequest: {
                assets: this.pool.tokens.map((token) =>
                    data.wethIsEth ? this.baseService.wethToZero(token.address) : token.address,
                ),
                maxAmountsIn: amountsIn,
                userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(amountsIn, parseUnits(data.minimumBpt, 18)),
                fromInternalBalance: true,
            },
            value: joinHasNativeAsset ? ethAmountScaled : Zero,
            outputReference: data.zapIntoMasterchefFarm ? this.batchRelayerService.toChainedReference(0) : Zero,
        });

        calls.push(encodedJoinPool);

        if (data.zapIntoMasterchefFarm) {
            const masterChefDeposit = this.batchRelayerService.masterChefEncodeDeposit({
                sender: this.batchRelayerService.batchRelayerAddress,
                recipient: data.userAddress,
                token: this.pool.address,
                pid: parseInt(this.pool.staking!.id),
                amount: this.batchRelayerService.toChainedReference(0),
                outputReference: Zero,
            });

            calls.push(masterChefDeposit);
        }

        console.log('calls', calls);
        return {
            type: 'BatchRelayer',
            calls,
            ethValue: ethAmount ? ethAmount.toString() : undefined,
        };
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        const { tokenAmountsMappedToPoolTokens } = await this.getJoinSwaps([fixedAmount]);

        if (tokenAmountsMappedToPoolTokens.length !== 1) {
            throw new Error('PoolWeightedBoostedService: Incorrect token amounts returned by getJoinSwaps');
        }

        return this.weightedPoolService.joinGetProportionalSuggestionForFixedAmount(tokenAmountsMappedToPoolTokens[0]);
    }

    //we're disregarding the price impact of entering the phantom stable.
    //assuming deep enough liquidity, the price impact there should be negligible
    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { tokenAmountsMappedToPoolTokens } = await this.getJoinSwaps(tokenAmountsIn);
        const bptAmount = this.weightedPoolService.exactTokensInForBPTOut(tokenAmountsMappedToPoolTokens);

        if (bptAmount.lt(0)) {
            return { priceImpact: 0, minBptReceived: '0' };
        }

        const bptZeroPriceImpact = this.weightedPoolService.bptForTokensZeroPriceImpact(tokenAmountsMappedToPoolTokens);
        const minBptReceived = bptAmount.minus(bptAmount.times(slippage)).toFixed(0);

        return {
            priceImpact: bptAmount.div(bptZeroPriceImpact).minus(1).toNumber(),
            minBptReceived: formatFixed(minBptReceived.toString(), 18),
        };
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        throw new Error('TODO: implement');
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        throw new Error('TODO: implement');
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        throw new Error('TODO: implement');
    }

    public async exitGetProportionalWithdrawEstimate(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]> {
        return [];
    }

    private async getJoinSwaps(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
        tokenAmountsMappedToPoolTokens: TokenAmountHumanReadable[];
        tokensOut: string[];
    }> {
        const joinSwaps: { swaps: SwapV2[]; assets: string[] }[] = [];

        for (const tokenAmountIn of tokenAmountsIn) {
            const poolToken = poolFindPoolTokenFromOptions(
                tokenAmountIn.address,
                this.pool.tokens,
                this.pool.investConfig.options,
            );

            //we're only concerned with nested phantom bpts
            if (poolToken.__typename === 'GqlPoolTokenLinear' || poolToken.__typename === 'GqlPoolTokenPhantomStable') {
                //get join swaps adds this pool as the last item, which is not needed for the weighted pool so we remove it.
                const { swaps, assets } = poolGetJoinSwapForToken({
                    poolId: this.pool.id,
                    poolAddress: this.pool.address,
                    tokenAmountIn,
                    poolToken,
                });

                joinSwaps.push({ swaps: swaps.slice(0, swaps.length - 1), assets: assets.slice(0, assets.length - 1) });
            }
        }

        const { swaps, assets } = poolBatchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider: this.provider,
        });

        const tokensOut: string[] = [];
        const tokenAmountsMappedToPoolTokens = tokenAmountsIn.map((tokenAmountIn) => {
            const poolToken = poolFindPoolTokenFromOptions(
                tokenAmountIn.address,
                this.pool.tokens,
                this.pool.investConfig.options,
            );

            if (poolToken.__typename === 'GqlPoolTokenPhantomStable' || poolToken.__typename === 'GqlPoolTokenLinear') {
                const assetIndex = assets.findIndex((asset) => asset === poolToken.address);
                const delta = deltas[assetIndex];

                tokensOut.push(poolToken.address);

                return {
                    address: poolToken.address,
                    amount: formatFixed(oldBnum(delta).abs().toString(), 18),
                };
            }

            return tokenAmountIn;
        });

        return { swaps, assets, deltas, tokenAmountsMappedToPoolTokens, tokensOut };
    }
}
