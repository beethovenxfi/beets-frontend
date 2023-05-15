import { GqlPoolGyro } from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitData,
    PoolExitPoolContractCallData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
    poolWeightedBptForTokensZeroPriceImpact,
    poolWeightedExactTokensInForBPTOut,
} from '~/lib/services/pool/lib/util';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';
import { PoolProportionalInvestService } from './lib/pool-proportional-invest.service';
import { PoolBaseService } from './lib/pool-base.service';
import { WeightedPoolEncoder } from '@balancer-labs/balancer-js';
import { parseUnits } from 'ethers/lib/utils.js';
import { formatFixed } from '@ethersproject/bignumber';
import { oldBnumSubtractSlippage } from './lib/old-big-number';

export class PoolGyroService implements PoolService {
    private readonly proportionalInvestService: PoolProportionalInvestService;
    private readonly baseService: PoolBaseService;

    constructor(private pool: GqlPoolGyro, private readonly wethAddress: string) {
        this.proportionalInvestService = new PoolProportionalInvestService(pool);
        this.baseService = new PoolBaseService(pool, wethAddress);
    }

    public updatePool(pool: GqlPoolGyro) {
        this.pool = pool;
    }

    public async joinGetMaxProportionalForUserBalances(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        const fixedAmount = await this.proportionalInvestService.getProportionalSuggestion(userInvestTokenBalances);

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
        return poolGetProportionalJoinAmountsForFixedAmount(fixedAmount, this.pool.tokens);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        const bptAmountOut = 'minimumBpt' in data ? data.minimumBpt : '0';
        const assets = this.pool.tokens.map((token) =>
            data.wethIsEth ? this.baseService.wethToZero(token.address) : token.address,
        );
        const maxAmountsIn = poolScaleTokenAmounts(data.maxAmountsIn, this.pool.tokens);
        // rn gyro only supports "ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"
        const userData = WeightedPoolEncoder.joinAllTokensInForExactBPTOut(parseUnits(bptAmountOut));

        return { type: 'JoinPool', assets, maxAmountsIn, userData };
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const bptAmount = poolWeightedExactTokensInForBPTOut(tokenAmountsIn, this.pool);

        if (bptAmount.lt(0)) {
            return { priceImpact: 0, minBptReceived: '0' };
        }

        const bptZeroPriceImpact = poolWeightedBptForTokensZeroPriceImpact(tokenAmountsIn, this.pool);
        const minBptReceived = bptAmount.minus(bptAmount.times(slippage)).toFixed(0);

        return {
            priceImpact: bptAmount.div(bptZeroPriceImpact).minus(1).toNumber(),
            minBptReceived: formatFixed(minBptReceived.toString(), 18),
        };
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalExitAmountsForBptIn(bptIn, this.pool.tokens, this.pool.dynamicData.totalShares);
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        // rn gyro does not support single asset withdraw
        return {
            bptIn: '0',
            priceImpact: 0,
        };
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        // rn gyro does not support single asset withdraw
        return {
            tokenAmount: '0',
            priceImpact: 0,
        };
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitPoolContractCallData> {
        switch (data.kind) {
            case 'ExactBPTInForOneTokenOut': {
                const token = this.pool.tokens.find((token) => token.address === data.tokenOutAddress);
                const amountMinusSlippage = oldBnumSubtractSlippage(
                    data.amountOut,
                    token?.decimals || 18,
                    data.slippage,
                );

                return {
                    type: 'ExitPool',
                    assets: this.pool.tokens.map((token) => token.address),
                    minAmountsOut: poolScaleTokenAmounts(
                        [{ address: data.tokenOutAddress, amount: amountMinusSlippage }],
                        this.pool.tokens,
                    ),
                    userData: this.encodeExitPool(data),
                };
            }
            case 'ExactBPTInForTokensOut': {
                const minAmountsOut = data.amountsOut.map((amountOut) => {
                    const token = this.pool.tokens.find((token) => token.address === amountOut.address);

                    return {
                        address: amountOut.address,
                        amount: oldBnumSubtractSlippage(amountOut.amount, token?.decimals || 18, data.slippage),
                    };
                });

                return {
                    type: 'ExitPool',
                    assets: this.pool.tokens.map((token) => token.address),
                    minAmountsOut: poolScaleTokenAmounts(minAmountsOut, this.pool.tokens),
                    userData: this.encodeExitPool(data),
                };
            }
        }

        throw new Error('unsupported exit');
    }

    private encodeExitPool(data: PoolExitData): string {
        if (data.kind == 'ExactBPTInForOneTokenOut') {
            const token = poolGetRequiredToken(data.tokenOutAddress, this.pool.tokens);
            return WeightedPoolEncoder.exitExactBPTInForOneTokenOut(parseUnits(data.bptAmountIn), token.index);
        } else if (data.kind == 'ExactBPTInForTokensOut') {
            return WeightedPoolEncoder.exitExactBPTInForTokensOut(parseUnits(data.bptAmountIn));
        } else if (data.kind === 'BPTInForExactTokensOut') {
            return WeightedPoolEncoder.exitBPTInForExactTokensOut(
                poolScaleTokenAmounts(data.amountsOut, this.pool.tokens),
                parseUnits(data.maxBPTAmountIn),
            );
        }

        throw new Error('Unsupported exit type');
    }
}
