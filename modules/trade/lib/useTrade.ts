import { makeVar, NetworkStatus, useReactiveVar } from '@apollo/client';
import {
    GqlSorGetSwapsResponseFragment,
    GqlSorSwapType,
    useGetSorSwapsLazyQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import { isEth, isWeth } from '~/lib/services/token/token-util';
import { useOnChainSwapInfoQuery } from '~/modules/trade/lib/useOnChainSwapInfoQuery';

interface TradeState {
    tokenIn: string;
    tokenOut: string;
    swapType: GqlSorSwapType;
    swapAmount: string | null;
    swapInfo: GqlSorGetSwapsResponseFragment | null;
    cleared: boolean;
}

const tradeStateVar = makeVar<TradeState>({
    tokenIn: networkConfig.defaultTokenIn,
    tokenOut: networkConfig.defaultTokenOut,
    swapType: 'EXACT_IN',
    swapAmount: null,
    cleared: false,
    swapInfo: null,
});

export function useTrade() {
    const reactiveTradeState = useReactiveVar(tradeStateVar);

    const [loadSwapInfo, { stopPolling: tradeStopPolling, startPolling, networkStatus, loading, error }] =
        useGetSorSwapsLazyQuery({
            fetchPolicy: 'no-cache',
            notifyOnNetworkStatusChange: true,
        });

    const {
        onChainSwapInfo,
        error: onChainError,
        refetch: refetchOnChainData,
        isLoading: loadingOnChainData,
        isFetching: fetchingOnChainData,
    } = useOnChainSwapInfoQuery(reactiveTradeState.swapInfo);

    const swapInfo = onChainSwapInfo || reactiveTradeState.swapInfo;
    const priceImpact = parseFloat(swapInfo?.priceImpact || '0');
    const hasNoticeablePriceImpact = priceImpact >= networkConfig.priceImpact.trade.noticeable;
    const hasHighPriceImpact = priceImpact >= networkConfig.priceImpact.trade.high;
    const isNativeAssetWrap = isEth(reactiveTradeState.tokenIn) && isWeth(reactiveTradeState.tokenOut);
    const isNativeAssetUnwrap = isEth(reactiveTradeState.tokenOut) && isWeth(reactiveTradeState.tokenIn);

    function tradeStartPolling() {
        startPolling(30000);
    }

    async function loadSwaps() {
        const state = getLatestTradeState();

        if (!state.tokenIn || !state.tokenOut || !state.swapType || !state.swapAmount) {
            return null;
        }

        const { data } = await loadSwapInfo({
            fetchPolicy: 'no-cache',
            variables: {
                tokenIn: state.tokenIn,
                tokenOut: state.tokenOut,
                swapAmount: state.swapAmount || '0',
                swapType: state.swapType,
                swapOptions: {
                    maxPools: 8,
                },
            },
        });

        const swapInfo = data?.swaps || null;

        setTradeState({ swapInfo });

        return swapInfo;
    }

    function getLatestTradeState(): TradeState {
        return tradeStateVar();
    }

    function setTradeState(input: Partial<TradeState>) {
        tradeStateVar({
            ...tradeStateVar(),
            ...input,
        });
    }

    return {
        loadSwaps,
        reactiveTradeState: {
            ...reactiveTradeState,
            swapInfo: swapInfo,
        },
        swapInfo,
        loadingSwaps: loading || loadingOnChainData,
        refetchingSwaps: networkStatus === NetworkStatus.refetch || fetchingOnChainData,
        error: error || onChainError,
        networkStatus,
        getLatestTradeState,
        setTradeState,
        tradeStartPolling,
        tradeStopPolling,
        priceImpact,
        hasNoticeablePriceImpact,
        hasHighPriceImpact,
        isNativeAssetWrap,
        isNativeAssetUnwrap,
        refetchOnChainData,
    };
}
