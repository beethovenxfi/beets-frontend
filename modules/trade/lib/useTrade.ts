import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlSorGetSwapsResponseFragment,
    GqlSorSwapType,
    useGetSorSwapsLazyQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import { useEffect } from 'react';
import { isEth, isWeth } from '~/lib/services/token/token-util';

type TradeState = {
    tokenIn: string;
    tokenOut: string;
    swapType: GqlSorSwapType;
    swapAmount: string | null;
    sorResponse: GqlSorGetSwapsResponseFragment | null;
};

export const tradeStateVar = makeVar<TradeState>({
    tokenIn: networkConfig.defaultTokenIn,
    tokenOut: networkConfig.defaultTokenOut,
    swapType: 'EXACT_IN',
    swapAmount: null,
    sorResponse: null,
});

const lastFetchTimestampVar = makeVar<Date | null>(null);
const isFetchingVar = makeVar(false);

export function useTrade() {
    // swap related data
    const reactiveTradeState = useReactiveVar(tradeStateVar);
    // overarching trade context

    const priceImpact = parseFloat(reactiveTradeState.sorResponse?.priceImpact || '0');
    const hasNoticeablePriceImpact = priceImpact >= networkConfig.priceImpact.trade.noticeable;
    const hasHighPriceImpact = priceImpact >= networkConfig.priceImpact.trade.high;
    const isNativeAssetWrap = isEth(reactiveTradeState.tokenIn) && isWeth(reactiveTradeState.tokenOut);
    const isNativeAssetUnwrap = isEth(reactiveTradeState.tokenOut) && isWeth(reactiveTradeState.tokenIn);

    // make sure not to cache as this data needs to be always fresh
    const [load, { loading, error, data, networkStatus, stopPolling: tradeStopPolling, startPolling }] =
        useGetSorSwapsLazyQuery({
            fetchPolicy: 'no-cache',
            pollInterval: 30000,
            notifyOnNetworkStatusChange: true,
        });

    useEffect(() => {
        if (loading && !isFetchingVar()) {
            isFetchingVar(true);
        } else if (!loading && isFetchingVar()) {
            isFetchingVar(false);
            lastFetchTimestampVar(new Date());
        }
    }, [loading]);

    function tradeStartPolling() {
        startPolling(30000);
    }

    async function loadSwaps(type: GqlSorSwapType, amount: string) {
        tradeStopPolling();
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

        tradeStartPolling();

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
        swapInfo: reactiveTradeState.sorResponse,
        loadingSwaps: loading,
        error,
        networkStatus,
        setTradeConfig,
        setTokens,
        getLatestState,
        tradeStartPolling,
        tradeStopPolling,
        lastFetchTimestamp: lastFetchTimestampVar(),
        priceImpact,
        hasNoticeablePriceImpact,
        hasHighPriceImpact,
        isNativeAssetWrap,
        isNativeAssetUnwrap,
    };
}
