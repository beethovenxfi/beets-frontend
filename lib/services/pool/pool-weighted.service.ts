import { BigNumber } from 'ethers';
import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import * as SDK from '@georgeroman/balancer-v2-pools';
import { oldBnum, oldBnumDenormAmount, oldBnumToBnum } from '~/lib/services/pool/lib/old-big-number';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    oldBnumPoolScaleTokenAmounts,
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/pool-util';
import { weightedBPTForTokensZeroPriceImpact } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolJoinData,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { formatFixed } from '@ethersproject/bignumber';
import { WeightedPoolEncoder } from '@balancer-labs/balancer-js';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';

export class PoolWeightedService implements PoolService {
    private baseService: PoolBaseService;
    constructor(private pool: GqlPoolWeighted) {
        this.baseService = new PoolBaseService(pool);
    }

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
        this.baseService.updatePool(pool);
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
        const denormAmounts = oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        return weightedBPTForTokensZeroPriceImpact(
            this.baseService.tokenBalancesScaled.map((balance) => oldBnumToBnum(balance)),
            this.pool.tokens.map((token) => token.decimals),
            this.baseService.tokenWeightsScaled.map((weight) => oldBnumToBnum(weight)),
            denormAmounts.map((amount) => oldBnumToBnum(amount)),
            parseUnits(this.pool.dynamicData.totalShares),
        );
    }

    public exactTokensInForBPTOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const result = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
            this.baseService.tokenBalancesScaled,
            this.baseService.tokenWeightsScaled,
            oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return BigNumber.from(result.toString());
    }

    public bptInForExactTokensOut(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const result = SDK.WeightedMath._calcBptInGivenExactTokensOut(
            this.baseService.tokenBalancesScaled,
            this.baseService.tokenWeightsScaled,
            oldBnumPoolScaleTokenAmounts(tokenAmounts, this.pool.tokens),
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return oldBnumToBnum(result);
    }

    public bptInForExactTokenOut(tokenAmountOut: TokenAmountHumanReadable): BigNumber {
        const token = poolGetRequiredToken(tokenAmountOut.address, this.pool.tokens);
        const tokenBalance = oldBnumDenormAmount(token.balance, token.decimals);
        const tokenNormalizedWeight = oldBnumDenormAmount(token.weight || '0');
        const amountOut = oldBnumDenormAmount(tokenAmountOut.amount);

        const result = SDK.WeightedMath._calcBptInGivenExactTokenOut(
            tokenBalance,
            tokenNormalizedWeight,
            amountOut,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return oldBnumToBnum(result);
    }

    public exactBPTInForTokenOut(bptAmount: AmountHumanReadable, tokenAddress: string): BigNumber {
        const token = poolGetRequiredToken(tokenAddress, this.pool.tokens);
        const tokenBalance = oldBnumDenormAmount(token.balance, token.decimals);
        const tokenNormalizedWeight = oldBnum(token.weight || '0');
        const bptAmountIn = oldBnumDenormAmount(bptAmount);

        const result = SDK.WeightedMath._calcTokenOutGivenExactBptIn(
            tokenBalance,
            tokenNormalizedWeight,
            bptAmountIn,
            this.baseService.totalSharesScaled,
            this.baseService.swapFeeScaled,
        );

        return oldBnumToBnum(result);
    }

    private encodeJoinPool(data: PoolJoinData): string {
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
