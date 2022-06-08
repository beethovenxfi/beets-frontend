import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlSorGetSwapsResponse,
    GqlSorGetSwapsResponseFragment,
    GqlSorSwapType,
    useGetSorSwapsLazyQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';

type TradeState = {
    tokenIn: string;
    tokenOut: string;
    swapType: GqlSorSwapType;
    swapAmount: string | null;
    sorResponse: GqlSorGetSwapsResponseFragment | null;
};

type TradeContext = {
    isPreviewVisible: boolean;
};

const tradeStateVar = makeVar<TradeState>({
    tokenIn: networkConfig.defaultTokenIn,
    tokenOut: networkConfig.defaultTokenOut,
    swapType: 'EXACT_IN',
    swapAmount: null,
    sorResponse: null,
});

const tradeContextVar = makeVar<TradeContext>({
    isPreviewVisible: false,
});

export function useTrade() {
    // swap related data
    const reactiveTradeState = useReactiveVar(tradeStateVar);
    // overarching trade context

    const tradeContext = useReactiveVar(tradeContextVar);
    // make sure not to cache as this data needs to be always fresh
    const [load, { loading, error, data, networkStatus }] = useGetSorSwapsLazyQuery({ fetchPolicy: 'no-cache' });

    async function loadSwaps(type: GqlSorSwapType, amount: string) {
        const state = getLatestState();

        if (!state.tokenIn || !state.tokenOut || (!state.swapType && !type) || (!state.swapAmount && !amount)) {
            return null;
        }

        const { data } = await load({
            fetchPolicy: 'no-cache',
            variables: {
                tokenIn: state.tokenIn,
                tokenOut: state.tokenOut,
                swapAmount: amount || '0',
                swapType: type,
                swapOptions: {
                    maxPools: 8,
                },
            },
        });
        const swaps = data?.swaps || null;
        tradeStateVar({ ...state, swapAmount: amount || '0', sorResponse: swaps });

        return swaps;
    }

    function clearSwaps() {
        tradeStateVar({
            ...tradeStateVar(),
            sorResponse: null,
        });
    }

    function setTradeConfig(type: GqlSorSwapType, amount: string) {
        tradeStateVar({
            ...tradeStateVar(),
            swapType: type,
            swapAmount: amount,
        });
    }

    function setPreviewVisible(visible: boolean) {
        tradeContextVar({
            ...tradeContext,
            isPreviewVisible: visible,
        });
    }

    function setTokens(input: { tokenIn?: string; tokenOut?: string }) {
        tradeStateVar({
            ...tradeStateVar(),
            ...input,
        });
    }

    function getLatestState(): TradeState {
        return tradeStateVar();
    }

    return {
        loadSwaps,
        clearSwaps,
        reactiveTradeState,
        swaps: reactiveTradeState.sorResponse,
        loadingSwaps: loading,
        error,
        networkStatus,
        tradeContext,
        setTradeConfig,
        setPreviewVisible,
        setTokens,
        getLatestState,
    };
}
