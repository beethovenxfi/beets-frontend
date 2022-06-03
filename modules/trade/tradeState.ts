import { makeVar, useReactiveVar } from '@apollo/client';
import { GqlSorGetSwapsResponse, useGetSorSwapsLazyQuery } from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';

interface TradeState {
    tokenIn: string | null;
    tokenOut: string | null;
    swapType: 'EXACT_IN' | 'EXACT_OUT';
    swapAmount: string | null;

    sorResponse: GqlSorGetSwapsResponse | null;
}

export const tradeStateVar = makeVar<TradeState>({
    tokenIn: networkConfig.defaultTokenIn,
    tokenOut: networkConfig.defaultTokenOut,
    swapType: 'EXACT_IN',
    swapAmount: null,
    sorResponse: null,
});

export function useGetSwaps() {
    const tradeState = useReactiveVar(tradeStateVar);
    // make sure not to cache as this data needs to be always fresh
    const [load, { loading, error, data, networkStatus }] = useGetSorSwapsLazyQuery({ fetchPolicy: 'no-cache' });

    async function loadSwaps() {
        if (tradeState.tokenIn && tradeState.tokenOut && tradeState.swapAmount) {
            const { data } = await load({
                fetchPolicy: 'no-cache',
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
            const swaps = data?.swaps || null;
            tradeState.sorResponse = swaps;
            return swaps;
        }
        return null;
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
