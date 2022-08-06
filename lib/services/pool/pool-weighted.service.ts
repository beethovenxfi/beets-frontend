import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScaleAmount,
    oldBnumSubtractSlippage,
    oldBnumToBnum,
} from '~/lib/services/pool/lib/old-big-number';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    oldBnumPoolScaleTokenAmounts,
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/util';
import { weightedBPTForTokensZeroPriceImpact } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
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
import { formatFixed } from '@ethersproject/bignumber';
import { WeightedPoolEncoder } from '@balancer-labs/balancer-js';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import OldBigNumber from 'bignumber.js';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';

export class PoolWeightedService implements PoolService {
    private baseService: PoolBaseService;
    constructor(
        private pool: GqlPoolWeighted,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
    ) {
        this.baseService = new PoolBaseService(pool, wethAddress);
    }

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
        this.baseService.updatePool(pool);
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalJoinAmountsForFixedAmount(fixedAmount, this.pool.tokens);
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const bptAmount = this.exactTokensInForBPTOut(tokenAmountsIn);

        if (bptAmount.lt(0)) {
            return { priceImpact: 0, minBptReceived: '0' };
        }

        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmountsIn);
        const minBptReceived = bptAmount.minus(bptAmount.times(slippage)).toFixed(0);

        return {
            priceImpact: bptAmount.div(bptZeroPriceImpact).minus(1).toNumber(),
            minBptReceived: formatFixed(minBptReceived.toString(), 18),
        };
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        const assets = this.pool.tokens.map((token) =>
            data.wethIsEth ? this.baseService.wethToZero(token.address) : token.address,
        );
        const maxAmountsIn = poolScaleTokenAmounts(data.maxAmountsIn, this.pool.tokens);
        const userData = this.encodeJoinPool(data);

        if (data.zapIntoMasterchefFarm && this.pool.staking?.type === 'MASTER_CHEF' && this.pool.staking.farm) {
            return this.batchRelayerService.encodeJoinPoolAndStakeInMasterChefFarm({
                userData,
                pool: this.pool,
                assets,
                maxAmountsIn,
                userAddress: data.userAddress,
            });
        }

        return { type: 'JoinPool', assets, maxAmountsIn, userData };
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalExitAmountsForBptIn(bptIn, this.pool.tokens, this.pool.dynamicData.totalShares);
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        const bptAmount = oldBnumFromBnum(parseUnits(bptIn));
        const token = poolGetRequiredToken(tokenOutAddress, this.pool.tokens);
        const tokenAmount = this.exactBPTInForTokenOut(bptIn, tokenOutAddress);
        const tokenAmountHumanReadable = formatFixed(tokenAmount.toString(), token.decimals);
        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact([
            { address: tokenOutAddress, amount: tokenAmountHumanReadable },
        ]);

        return {
            tokenAmount: tokenAmountHumanReadable,
            priceImpact: bptAmount.div(bptZeroPriceImpact).minus(1).toNumber(),
        };
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        const bptIn = this.bptInForExactTokenOut(tokenAmount);
        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact([tokenAmount]);

        return {
            bptIn: formatFixed(bptIn.toString(), 18),
            priceImpact: bptIn.div(bptZeroPriceImpact).minus(1).toNumber(),
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

    public bptForTokensZeroPriceImpact(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        const denormAmounts = oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        const result = weightedBPTForTokensZeroPriceImpact(
            this.baseService.tokenBalancesScaled.map((balance) => oldBnumToBnum(balance)),
            this.pool.tokens.map((token) => token.decimals),
            this.baseService.tokenWeightsScaled.map((weight) => oldBnumToBnum(weight)),
            denormAmounts.map((amount) => oldBnumToBnum(amount)),
            parseUnits(this.pool.dynamicData.totalShares),
        );

        return oldBnumFromBnum(result);
    }

    public exactTokensInForBPTOut(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        return SDK.WeightedMath._calcBptOutGivenExactTokensIn(
            this.baseService.tokenBalancesScaled,
            this.baseService.tokenWeightsScaled,
            oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public bptInForExactTokensOut(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        return SDK.WeightedMath._calcBptInGivenExactTokensOut(
            this.baseService.tokenBalancesScaled,
            this.baseService.tokenWeightsScaled,
            oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public bptInForExactTokenOut(tokenAmountOut: TokenAmountHumanReadable): OldBigNumber {
        const token = poolGetRequiredToken(tokenAmountOut.address, this.pool.tokens);
        const tokenBalance = oldBnumScaleAmount(token.balance, token.decimals);
        const tokenNormalizedWeight = oldBnum(token.weight ? parseUnits(token.weight).toString() : '0');
        const amountOut = oldBnumScaleAmount(tokenAmountOut.amount, token.decimals);

        return SDK.WeightedMath._calcBptInGivenExactTokenOut(
            tokenBalance,
            tokenNormalizedWeight,
            amountOut,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public exactBPTInForTokenOut(bptAmount: AmountHumanReadable, tokenAddress: string): OldBigNumber {
        const token = poolGetRequiredToken(tokenAddress, this.pool.tokens);
        const tokenBalance = oldBnumScaleAmount(token.balance, token.decimals);
        const tokenNormalizedWeight = oldBnum(token.weight ? parseUnits(token.weight).toString() : '0');
        const bptAmountIn = oldBnumScaleAmount(bptAmount);

        return SDK.WeightedMath._calcTokenOutGivenExactBptIn(
            tokenBalance,
            tokenNormalizedWeight,
            bptAmountIn,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public encodeJoinPool(data: PoolJoinData): string {
        if (data.kind == 'Init') {
            return WeightedPoolEncoder.joinInit(poolScaleTokenAmounts(data.tokenAmountsIn, this.pool.tokens));
        } else if (data.kind == 'ExactTokensInForBPTOut') {
            return WeightedPoolEncoder.joinExactTokensInForBPTOut(
                poolScaleTokenAmounts(data.tokenAmountsIn, this.pool.tokens),
                parseUnits(data.minimumBpt),
            );
        } else if (data.kind == 'AllTokensInForExactBPTOut') {
            return WeightedPoolEncoder.joinAllTokensInForExactBPTOut(parseUnits(data.bptAmountOut));
        } else if (data.kind === 'TokenInForExactBPTOut') {
            const token = poolGetRequiredToken(data.tokenInAddress, this.pool.tokens);

            return WeightedPoolEncoder.joinTokenInForExactBPTOut(parseUnits(data.bptAmountOut), token.index);
        }

        throw new Error('unsupported join type');
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
