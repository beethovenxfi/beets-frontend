import { tradeStateVar, useTrade } from '~/modules/trade/lib/useTrade';
import { useBoolean } from '@chakra-ui/hooks';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { makeVar, NetworkStatus, useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { GqlSorSwapType } from '~/apollo/generated/graphql-codegen-generated';
import { oldBnumToFixed } from '~/lib/services/pool/lib/old-big-number';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';
import { isAddress } from 'ethers/lib/utils';
import { tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { useGetTokens } from '~/lib/global/useToken';

const buyAmountVar = makeVar<AmountHumanReadable>('');
const sellAmountVar = makeVar<AmountHumanReadable>('1');
const tokenSelectedVar = makeVar<'tokenIn' | 'tokenOut'>('tokenIn');

export function useTradeCard() {
    const router = useRouter();
    const { tokenIn: initialTokenIn, tokenOut: initialTokenOut } = router.query;
    const { getToken } = useGetTokens();

    const {
        reactiveTradeState,
        loadSwaps: _loadSwaps,
        loadingSwaps,
        clearSwaps,
        setTradeConfig,
        getLatestState,
        setTokens,
        networkStatus,
        swapInfo,
        tradeStartPolling,
        tradeStopPolling,
        isNativeAssetWrap,
        isNativeAssetUnwrap,
    } = useTrade();

    // refetching the swapInfo may not always trigger the query loading state,
    // so we use a fallback flag to make sure that we always have some loading
    // even if the query is retrieving the 'same' value from the cache.
    const [isFetching, setIsFetching] = useBoolean();

    function setBuyAmount(amount: AmountHumanReadable) {
        buyAmountVar(amount);
    }

    function setSellAmount(amount: AmountHumanReadable) {
        sellAmountVar(amount);
    }

    function setTokenSelectKey(selected: 'tokenIn' | 'tokenOut') {
        tokenSelectedVar(selected);
    }

    const isLoadingOrFetching = loadingSwaps || isFetching || networkStatus === NetworkStatus.refetch;
    const hasAmount = parseFloat(sellAmountVar()) > 0 || parseFloat(buyAmountVar()) > 0;
    const isNotEnoughLiquidity = swapInfo && swapInfo.swaps.length === 0 && hasAmount;

    useEffect(() => {
        if (initialTokenIn || initialTokenOut) {
            const tradeState = tradeStateVar();

            //TODO: need to support importing of unknown tokens here
            tradeStateVar({
                ...tradeState,
                sorResponse: null,
                tokenIn:
                    typeof initialTokenIn === 'string' && isAddress(initialTokenIn)
                        ? initialTokenIn.toLowerCase()
                        : tradeState.tokenIn,
                tokenOut:
                    typeof initialTokenOut === 'string' && isAddress(initialTokenOut)
                        ? initialTokenOut.toLowerCase()
                        : tradeState.tokenIn,
            });
        }

        setIsFetching.on();
        dFetchTrade('EXACT_IN', sellAmountVar());
    }, [initialTokenIn, initialTokenOut]);

    const fetchTrade = async (type: GqlSorSwapType, amount: string) => {
        setTradeConfig(type, amount);

        if (isNativeAssetUnwrap || isNativeAssetWrap) {
            if (type === 'EXACT_IN') {
                setBuyAmount(amount);
            } else {
                setSellAmount(amount);
            }

            tradeStopPolling();
            setIsFetching.off();

            return;
        }

        const trade = await _loadSwaps(type, amount);
        const resultAmount = trade?.returnAmount || '0';
        const resultAmountFixed = resultAmount ? oldBnumToFixed(resultAmount, 6) : '';

        if (parseFloat(resultAmountFixed) === 0) {
            if (type === 'EXACT_IN') {
                setBuyAmount('');
            } else {
                setSellAmount('');
            }
        } else {
            if (type === 'EXACT_IN') {
                setBuyAmount(resultAmountFixed);
            } else {
                setSellAmount(resultAmountFixed);
            }
        }

        setIsFetching.off();
    };

    const dFetchTrade = useDebouncedCallback((type: 'EXACT_IN' | 'EXACT_OUT', amount: string) => {
        fetchTrade(type, amount);
    }, 300);

    const handleSellAmountChanged = async (event: { currentTarget: { value: string } }) => {
        const amount = event.currentTarget.value;

        if (amount === '' || parseFloat(amount) === 0) {
            dFetchTrade.cancel();
            setSellAmount(amount);
            setBuyAmount('');
            setIsFetching.off();
            clearSwaps();
        } else {
            setIsFetching.on();
            dFetchTrade('EXACT_IN', amount);
            setSellAmount(amount);
        }
    };

    const handleBuyAmountChanged = async (event: { currentTarget: { value: string } }) => {
        const amount = event.currentTarget.value;

        if (amount === '' || parseFloat(amount) === 0) {
            dFetchTrade.cancel();
            setBuyAmount(amount);
            setSellAmount('');
            setIsFetching.off();
            clearSwaps();
        } else {
            setIsFetching.on();
            dFetchTrade('EXACT_OUT', amount);
            setBuyAmount(amount);
        }
    };

    function handleTokenSelected(address: string) {
        const tradeState = tradeStateVar();
        const tokenSelectKey = tokenSelectedVar();

        const token = getToken(address || '');
        const sellAmount = tokenInputTruncateDecimalPlaces(sellAmountVar(), token ? token.decimals : 18);
        setSellAmount(sellAmount);

        const isTokenIn = tokenSelectKey === 'tokenIn';
        const otherToken = isTokenIn ? tradeState.tokenOut : tradeState.tokenIn;
        const currentToken = isTokenIn ? tradeState.tokenIn : tradeState.tokenOut;

        if (otherToken === address) {
            setTokens({ tokenIn: isTokenIn ? address : currentToken, tokenOut: !isTokenIn ? address : currentToken });
        } else {
            setTokens({ [tokenSelectKey]: address });
        }

        if (parseFloat(sellAmount || '0') > 0) {
            setIsFetching.on();
            dFetchTrade('EXACT_IN', sellAmount);
        }
    }

    const handleTokensSwitched = () => {
        const state = getLatestState();
        const buyAmount = buyAmountVar();

        tradeStateVar({ ...tradeStateVar(), sorResponse: null });

        setTokens({ tokenIn: state.tokenOut, tokenOut: state.tokenIn });
        setSellAmount(buyAmount);
        setBuyAmount('');
        dFetchTrade('EXACT_IN', buyAmount);
    };

    function refetchTrade() {
        const state = getLatestState();

        if (state.swapAmount) {
            setIsFetching.on();
            fetchTrade(state.swapType, state.swapAmount);
        }
    }

    return {
        tokenIn: reactiveTradeState.tokenIn,
        tokenOut: reactiveTradeState.tokenOut,
        sorResponse: reactiveTradeState.sorResponse,
        tokenSelectKey: useReactiveVar(tokenSelectedVar),
        sellAmount: useReactiveVar(sellAmountVar),
        buyAmount: useReactiveVar(buyAmountVar),
        isLoadingOrFetching,
        isNotEnoughLiquidity,
        setTokenSelectKey,
        handleTokenSelected,
        handleSellAmountChanged,
        handleBuyAmountChanged,
        handleTokensSwitched,
        refetchTrade,
        tradeStartPolling,
        tradeStopPolling,
        isNativeAssetWrap,
        isNativeAssetUnwrap,
    };
}
