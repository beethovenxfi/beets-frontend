import { makeVar } from '@apollo/client';
import { GqlSorGetSwapsResponse } from '~/apollo/generated/graphql-codegen-generated';

interface TradeState {
    tokenIn: string | null;
    tokenOut: string | null;
    swapType: 'EXACT_IN' | 'EXACT_OUT';
    amount: string | null;

    sorResponse: GqlSorGetSwapsResponse | null;
}

export const tradeStateVar = makeVar<TradeState>({
    tokenIn: null,
    tokenOut: null,
    swapType: 'EXACT_IN',
    amount: null,

    sorResponse: null,
});
