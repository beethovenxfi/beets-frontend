import { BigNumber } from 'ethers';
import { GqlPoolStable } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
import {
    oldBnum,
    oldBnumScaleAmount,
    oldBnumFromBnum,
    oldBnumToBnum,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/pool-util';
import { stableBPTForTokensZeroPriceImpact } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { formatFixed } from '@ethersproject/bignumber';
import { StablePoolEncoder } from '@balancer-labs/balancer-js';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';

/**
 * All stable pool functions except stableBPTForTokensZeroPriceImpact require all balances to be scaled to 18
 */
export class PoolStableService implements PoolService {
    private baseService: PoolBaseService;

    constructor(private pool: GqlPoolStable) {
        this.baseService = new PoolBaseService(pool);
    }

    public updatePool(pool: GqlPoolStable) {
        this.baseService.updatePool(pool);
        this.pool = pool;
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        throw new Error('TODO');
    }

    public async exitPoolEncode(data: PoolExitData): Promise<string> {
        const encoded = this.encodeExitPool(data);

        return '';
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalJoinAmountsForFixedAmount(fixedAmount, this.pool.tokens);
    }

    public async joinGetEstimate(
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

        //return BigNumber.from(1).sub(bptAmount.div(bptZeroPriceImpact)).toNumber();

        return {
            priceImpact: 0,
            minBptReceived: '0',
        };
    }

    public async exitGetProportionalWithdrawEstimate(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalExitAmountsForBptIn(bptIn, this.pool.tokens, this.pool.dynamicData.totalShares);
    }

    public async exitGetSingleAssetWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        /*const bptAmount = parseUnits(input.userBptBalance);
        const token = poolGetRequiredToken(input.tokenOutAddress, this.pool.tokens);
        const tokenAmount = this.exactBPTInForTokenOut(input.userBptBalance, input.tokenOutAddress);
        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact([
            { address: input.tokenOutAddress, amount: formatFixed(tokenAmount, token.decimals) },
        ]);*/

        //return bptAmount.div(bptZeroPriceImpact).sub(1).toNumber();

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

    public bptForTokensZeroPriceImpact(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        const denormAmounts = poolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        // _bptForTokensZeroPriceImpact is the only stable pool function
        // that requires balances be scaled by the token decimals and not 18
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
                this.baseService.tokenBalancesScaled,
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
            return StablePoolEncoder.joinExactTokensInForBPTOut(
                poolScaleTokenAmounts(data.tokenAmountsIn, this.pool.tokens),
                parseUnits(data.minimumBpt),
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
