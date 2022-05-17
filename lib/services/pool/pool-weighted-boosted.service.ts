import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolJoinData,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export class PoolWeightedBoostedService implements PoolService {
    constructor(private pool: GqlPoolWeighted) {}

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
    }

    public async joinPoolEncode(data: PoolJoinData): Promise<string> {
        return '';
    }

    public async exitPoolEncode(data: PoolExitData): Promise<string> {
        return '';
    }

    public async joinEstimatePriceImpact(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<number> {
        return 0;
    }

    public async exitEstimatePriceImpact(
        input: PoolExitBPTInForExactTokensOut | PoolExitExactBPTInForOneTokenOut,
    ): Promise<number> {
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
}
