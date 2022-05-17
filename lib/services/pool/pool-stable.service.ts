import { BigNumber } from 'ethers';
import { GqlPoolStable } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
import { oldBnum, oldBnumDenormAmount, oldBnumToBnum } from '~/lib/services/pool/lib/old-big-number';
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
    PoolJoinData,
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
            this.baseService.totalSharesScaled.toString(),
            this.baseService.ampScaled.toString(),
        );

        return BigNumber.from(bptZeroImpact);
    }

    public exactTokensInForBPTOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        try {
            const bptOut = SDK.StableMath._calcBptOutGivenExactTokensIn(
                this.baseService.ampScaled,
                this.baseService.tokenBalancesScaled,
                this.baseService.scaleTokenAmountsTo18Decimals(tokenAmounts),
                this.baseService.totalSharesScaled,
                this.baseService.swapFeeScaled,
            );

            return oldBnumToBnum(bptOut);
        } catch (error) {
            console.error(error);

            return BigNumber.from(0);
        }
    }

    public bptInForExactTokensOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            this.baseService.scaleTokenAmountsTo18Decimals(tokenAmounts),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return oldBnumToBnum(bptIn);
    }

    public bptInForExactTokenOut(tokenAmountOut: TokenAmountHumanReadable): BigNumber {
        const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            this.baseService.scaleTokenAmountsTo18Decimals([tokenAmountOut]),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
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
            this.baseService.ampScaled,
            this.baseService.tokenBalancesScaledTo18Decimals,
            token.index,
            bptAmountScaled,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        const tokenAmountOutScaledDown = this.baseService.scaleTokenAmountDownFrom18Decimals(
            token,
            tokenAmountOut,
            OldBigNumber.ROUND_DOWN,
        );

        return oldBnumToBnum(tokenAmountOutScaledDown);
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
