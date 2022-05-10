import { makeVar, useReactiveVar } from '@apollo/client';
import { GqlSorGetSwapsResponse, useGetSorSwapsLazyQuery } from '~/apollo/generated/graphql-codegen-generated';

interface TradeState {
    tokenIn: string | null;
    tokenOut: string | null;
    swapType: 'EXACT_IN' | 'EXACT_OUT';
    swapAmount: string | null;

    sorResponse: GqlSorGetSwapsResponse | null;
}

export const tradeStateVar = makeVar<TradeState>({
    tokenIn: null,
    tokenOut: null,
    swapType: 'EXACT_IN',
    swapAmount: null,

    sorResponse: null,
});

export function useGetSwaps() {
    const tradeState = useReactiveVar(tradeStateVar);
    const [load, { loading, error, data, networkStatus }] = useGetSorSwapsLazyQuery({});

    async function loadSwaps() {
        if (tradeState.tokenIn && tradeState.tokenOut && tradeState.swapAmount) {
            const { data } = await load({
                variables: {
                    tokenIn: tradeState.tokenIn,
                    tokenOut: tradeState.tokenOut,
                    swapAmount: tradeState.swapAmount,
                    swapType: tradeState.swapType,
                    swapOptions: {
                        maxPools: 8,
                    },
                },
            });

            tradeState.sorResponse = data?.swaps || null;
        }
    }

    return {
        loadSwaps,
        tradeState,
        swaps: data?.swaps || null,
        loadingSwaps: loading,
        error,
        networkStatus,
    };
}
