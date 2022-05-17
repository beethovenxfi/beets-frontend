import { BigNumber } from 'ethers';
import { GqlPoolStable, GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
import {
    oldBnum,
    oldBnumDenormAmount,
    oldBnumFromBnum,
    oldBnumToBnum,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleAmp,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/pool-util';
import { stableBPTForTokensZeroPriceImpact } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolJoinData,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { formatFixed } from '@ethersproject/bignumber';
import { StablePoolEncoder } from '@balancer-labs/balancer-js';

const POOL_DECIMALS = 18;

/**
 * All stable pool functions except stableBPTForTokensZeroPriceImpact require all balances to be scaled to 18
 */
export class PoolStableService implements PoolService {
    constructor(private pool: GqlPoolStable) {}

    public updatePool(pool: GqlPoolStable) {
        this.pool = pool;
    }

    public async joinPoolEncode(data: PoolJoinData): Promise<string> {
        if (data.zapIntoMasterchefFarm) {
            //do a batch relayer join
        } else {
            const encoded = this.encodeJoinPool(data);
        }

        return '';
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

    public async exitGetProportionalWithdraw(bptInHumanReadable: string): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalExitAmountsForBptIn(
            bptInHumanReadable,
            this.pool.tokens,
            this.pool.dynamicData.totalShares,
        );
    }

    public async joinEstimatePriceImpact(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<number> {
        const bptAmount = this.exactTokensInForBPTOut(tokenAmountsIn);

        if (bptAmount.lt(0)) {
            return 0;
        }

        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmountsIn);

        return BigNumber.from(1).sub(bptAmount.div(bptZeroPriceImpact)).toNumber();
    }

    public async exitEstimatePriceImpact(
        input: PoolExitBPTInForExactTokensOut | PoolExitExactBPTInForOneTokenOut,
    ): Promise<number> {
        if (input.kind === 'BPTInForExactTokensOut') {
            const bptAmount = this.bptInForExactTokensOut(input.amountsOut);
            const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(input.amountsOut);

            return bptAmount.div(bptZeroPriceImpact).sub(1).toNumber();
        } else {
            const bptAmount = parseUnits(input.userBptBalance);
            const token = poolGetRequiredToken(input.tokenOutAddress, this.pool.tokens);
            const tokenAmount = this.exactBPTInForTokenOut(input.userBptBalance, input.tokenOutAddress);
            const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact([
                { address: input.tokenOutAddress, amount: formatFixed(tokenAmount, token.decimals) },
            ]);

            return bptAmount.div(bptZeroPriceImpact).sub(1).toNumber();
        }
    }

    public bptForTokensZeroPriceImpact(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const denormAmounts = poolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        // _bptForTokensZeroPriceImpact is the only stable pool function
        // that requires balances be scaled by the token decimals and not 18
        const balances = this.pool.tokens.map((token) => parseUnits(token.balance, token.decimals));

        const bptZeroImpact = stableBPTForTokensZeroPriceImpact(
            balances,
            this.pool.tokens.map((token) => token.decimals),
            denormAmounts,
            this.totalSharesScaled.toString(),
            this.ampScaled.toString(),
        );

        return BigNumber.from(bptZeroImpact);
    }

    public exactTokensInForBPTOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        try {
            const bptOut = SDK.StableMath._calcBptOutGivenExactTokensIn(
                this.ampScaled,
                this.tokenBalancesScaled,
                this.scaleTokenAmountsTo18(tokenAmounts),
                this.totalSharesScaled,
                this.swapFeeScaled,
            );

            return oldBnumToBnum(bptOut);
        } catch (error) {
            console.error(error);

            return BigNumber.from(0);
        }
    }

    public bptInForExactTokensOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
            this.ampScaled,
            this.tokenBalancesScaled,
            this.scaleTokenAmountsTo18(tokenAmounts),
            this.totalSharesScaled,
            this.swapFeeScaled,
        );

        return oldBnumToBnum(bptIn);
    }

    public bptInForExactTokenOut(tokenAmountOut: TokenAmountHumanReadable): BigNumber {
        const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
            this.ampScaled,
            this.tokenBalancesScaled,
            this.scaleTokenAmountsTo18([tokenAmountOut]),
            this.totalSharesScaled,
            this.swapFeeScaled,
        );

        return oldBnumToBnum(bptIn);
    }

    public exactBPTInForTokenOut(bptAmount: AmountHumanReadable, tokenAddress: string): BigNumber {
        if (oldBnum(bptAmount).eq(0)) {
            return BigNumber.from(0);
        }

        const token = poolGetRequiredToken(tokenAddress, this.pool.tokens);
        const bptAmountScaled = oldBnumDenormAmount(bptAmount);

        const tokenAmountOut = SDK.StableMath._calcTokenOutGivenExactBptIn(
            this.ampScaled,
            this.tokenBalancesScaled,
            token.index,
            bptAmountScaled,
            this.totalSharesScaled,
            this.swapFeeScaled,
        );

        return oldBnumToBnum(this.scaleTokenAmountDown(token, tokenAmountOut, OldBigNumber.ROUND_DOWN));
    }

    private get totalSharesScaled(): OldBigNumber {
        return oldBnumDenormAmount(this.pool.dynamicData.totalShares, POOL_DECIMALS);
    }

    private get swapFeeScaled(): OldBigNumber {
        return oldBnumDenormAmount(this.pool.dynamicData.swapFee);
    }

    private get ampScaled(): OldBigNumber {
        return oldBnumFromBnum(poolScaleAmp(this.pool.amp));
    }

    private get tokenBalancesScaled(): OldBigNumber[] {
        return this.pool.tokens.map((token) =>
            this.scaleTo18AndApplyPriceRate({
                address: token.address,
                amount: token.balance,
            }),
        );
    }

    private scaleTo18AndApplyPriceRate(tokenAmount: TokenAmountHumanReadable): OldBigNumber {
        const token = poolGetRequiredToken(tokenAmount.address, this.pool.tokens);

        const denormAmount = oldBnum(parseUnits(tokenAmount.amount, 18).toString())
            .times(token.priceRate)
            .toFixed(0, OldBigNumber.ROUND_UP);

        return oldBnum(denormAmount);
    }

    private scaleTokenAmountsTo18(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber[] {
        return this.pool.tokens.map((poolToken) => {
            const tokenAmount = tokenAmounts.find((amount) => amount.address === poolToken.address);

            if (!tokenAmount) {
                return oldBnumZero();
            }

            return tokenAmount ? this.scaleTo18AndApplyPriceRate(tokenAmount) : oldBnumZero();
        });
    }

    private scaleTokenAmountDown(
        token: GqlPoolTokenBase,
        tokenAmount18decimals: OldBigNumber,
        rounding: OldBigNumber.RoundingMode,
    ): OldBigNumber {
        const amountAfterPriceRate = oldBnum(tokenAmount18decimals).div(token.priceRate).toString();

        const normalizedAmount = oldBnum(amountAfterPriceRate)
            .div(parseUnits('1', 18).toString())
            .toFixed(token.decimals, rounding);
        const scaledAmount = parseUnits(normalizedAmount, token.decimals);

        return oldBnum(scaledAmount.toString());
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
