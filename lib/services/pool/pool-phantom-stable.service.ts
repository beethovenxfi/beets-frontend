import { GqlPoolPhantomStable } from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import OldBigNumber from 'bignumber.js';
import { phantomStableBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '@balancer-labs/sor';
import { poolGetRequiredToken, poolScaleTokenAmounts } from '~/lib/services/pool/lib/pool-util';
import { parseUnits } from 'ethers/lib/utils';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { BigNumber } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';

export class PoolPhantomStableService implements PoolService {
    private readonly baseService: PoolBaseService;

    constructor(private pool: GqlPoolPhantomStable) {
        this.baseService = new PoolBaseService(pool);
    }

    public updatePool(pool: GqlPoolPhantomStable) {
        this.pool = pool;
        this.baseService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        throw new Error('TODO');
    }

    public async exitPoolEncode(data: PoolExitData): Promise<string> {
        return '';
    }

    public async joinGetEstimate(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        //TODO: determine the bpt amount received for tokenAmountsIn
        const bptAmount = BigNumber.from(0);

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

    public async exitEstimatePriceImpact(
        input: PoolExitBPTInForExactTokensOut | PoolExitExactBPTInForOneTokenOut,
    ): Promise<number> {
        //TODO: implement
        /*
        // Single asset exit
            if (opts.exactOut) {
                bptAmount = bnum(opts.queryBPT);
                bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts);
            } else {
                // Single asset max out case
                bptAmount = parseUnits(this.calc.bptBalance, this.calc.poolDecimals).toString();
                bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts);
            }

            return bnum(bptAmount).div(bptZeroPriceImpact).minus(1);
         */

        return 0;
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return [];
    }

    public async exitGetProportionalWithdraw(
        bptInHumanReadable: AmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return [];
    }

    private bptForTokensZeroPriceImpact(tokenAmounts: TokenAmountHumanReadable[]): BigNumber {
        const denormAmounts = poolScaleTokenAmounts(tokenAmounts, this.pool.tokens);

        // This function should use pool balances (i.e. without rate conversion)
        const poolTokenBalances = this.pool.tokens.map((token) => parseUnits(token.balance, token.decimals));
        const poolTokenDecimals = this.pool.tokens.map((token) => token.decimals);

        return _bptForTokensZeroPriceImpact(
            poolTokenBalances,
            poolTokenDecimals,
            denormAmounts,
            this.baseService.totalSharesScaled.toString(),
            this.baseService.ampScaled.toString(),
            this.baseService.swapFeeScaled.toString(),
            this.baseService.priceRatesScaled.map((priceRate) => priceRate.toString()),
        );
    }
}
