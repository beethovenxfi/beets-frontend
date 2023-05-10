import { GqlPoolStable } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScaleAmount,
    oldBnumSubtractSlippage,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/util';
import { stableBPTForTokensZeroPriceImpact } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
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
import { formatFixed } from '@ethersproject/bignumber';
import { StablePoolEncoder } from '@balancer-labs/balancer-js';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { Zero } from '@ethersproject/constants';

/**
 * All stable pool functions except stableBPTForTokensZeroPriceImpact require all balances to be scaled to 18
 */
export class PoolStableService implements PoolService {
    private baseService: PoolBaseService;

    constructor(
        private pool: GqlPoolStable,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
    ) {
        this.baseService = new PoolBaseService(pool, wethAddress);
    }

    public updatePool(pool: GqlPoolStable) {
        this.baseService.updatePool(pool);
        this.pool = pool;
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
            return {
                priceImpact: 0,
                minBptReceived: '0',
            };
        }

        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmountsIn);

        return {
            priceImpact: oldBnum(1).minus(bptAmount.div(bptZeroPriceImpact)).toNumber(),
            minBptReceived: formatFixed(bptAmount.toString(), 18),
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
        return poolGetProportionalExitAmountsForBptIn(bptIn, this.pool.tokens, this.pool.dynamicData.totalShares, true);
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

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
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
        const denormAmounts = poolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        // _bptForTokensZeroPriceImpact is the only stable pool function
        // that requires balances be scaled by the tokenWithAmount decimals and not 18
        const balances = this.pool.tokens.map((token) => parseUnits(token.balance, token.decimals));

        const bptZeroImpact = stableBPTForTokensZeroPriceImpact(
            balances,
            this.pool.tokens.map((token) => token.decimals),
            denormAmounts,
            this.baseService.totalSharesScaled.toString(),
            this.baseService.ampScaled.toString(),
        );

        return oldBnumFromBnum(bptZeroImpact);
    }

    public exactTokensInForBPTOut(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        try {
            return SDK.StableMath._calcBptOutGivenExactTokensIn(
                this.baseService.ampScaled,
                this.baseService.tokenBalancesScaledTo18Decimals,
                this.baseService.scaleTokenAmountsTo18Decimals(tokenAmounts),
                this.baseService.totalSharesScaled,
                this.baseService.swapFeeScaled,
            );
        } catch (error) {
            console.error(error);

            return oldBnumZero();
        }
    }

    public bptInForExactTokensOut(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        return SDK.StableMath._calcBptInGivenExactTokensOut(
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            this.baseService.scaleTokenAmountsTo18Decimals(tokenAmounts),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public bptInForExactTokenOut(tokenAmountOut: TokenAmountHumanReadable): OldBigNumber {
        return SDK.StableMath._calcBptInGivenExactTokensOut(
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            this.baseService.scaleTokenAmountsTo18Decimals([tokenAmountOut]),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );
    }

    public exactBPTInForTokenOut(bptAmount: AmountHumanReadable, tokenAddress: string): OldBigNumber {
        if (oldBnum(bptAmount).eq(0)) {
            return oldBnumZero();
        }

        const token = poolGetRequiredToken(tokenAddress, this.pool.tokens);
        const bptAmountScaled = oldBnumScaleAmount(bptAmount);

        const tokenAmountOut = SDK.StableMath._calcTokenOutGivenExactBptIn(
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            token.index,
            bptAmountScaled,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return this.baseService.scaleTokenAmountDownFrom18Decimals(token, tokenAmountOut, OldBigNumber.ROUND_DOWN);
    }

    private encodeJoinPool(data: PoolJoinData): string {
        if (data.kind == 'Init') {
            return StablePoolEncoder.joinInit(poolScaleTokenAmounts(data.tokenAmountsIn, this.pool.tokens));
        } else if (data.kind == 'ExactTokensInForBPTOut') {
            const minimumBptMinusSlippage = oldBnumSubtractSlippage(data.minimumBpt, 18, data.slippage);

            return StablePoolEncoder.joinExactTokensInForBPTOut(
                poolScaleTokenAmounts(data.tokenAmountsIn, this.pool.tokens),
                parseUnits(minimumBptMinusSlippage, 18),
            );
        } else if (data.kind === 'TokenInForExactBPTOut') {
            const token = poolGetRequiredToken(data.tokenInAddress, this.pool.tokens);

            return StablePoolEncoder.joinTokenInForExactBPTOut(parseUnits(data.bptAmountOut), token.index);
        }

        throw new Error('unsupported join type');
    }

    private encodeExitPool(data: PoolExitData): string {
        if (data.kind == 'ExactBPTInForOneTokenOut') {
            const token = poolGetRequiredToken(data.tokenOutAddress, this.pool.tokens);

            return StablePoolEncoder.exitExactBPTInForOneTokenOut(parseUnits(data.bptAmountIn), token.index);
        } else if (data.kind == 'ExactBPTInForTokensOut') {
            return StablePoolEncoder.exitExactBPTInForTokensOut(parseUnits(data.bptAmountIn));
        } else if (data.kind === 'BPTInForExactTokensOut') {
            return StablePoolEncoder.exitBPTInForExactTokensOut(
                poolScaleTokenAmounts(data.amountsOut, this.pool.tokens),
                parseUnits(data.maxBPTAmountIn),
            );
        }

        throw new Error('Unsupported exit type');
    }
}
