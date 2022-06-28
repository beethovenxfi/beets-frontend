import { Box, Divider, VStack } from '@chakra-ui/react';
import { useBoolean } from '@chakra-ui/hooks';
import { AnimatePresence, useAnimation } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';
import { TokenInputSwapButton } from '~/modules/trade/components/TokenInputSwapButton';
import { TradeCardSwapBreakdown } from '~/modules/trade/components/TradeCardSwapBreakdown';
import { RefreshCcw } from 'react-feather';
import { Button } from '@chakra-ui/button';
import { makeVar, NetworkStatus, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useEffect } from 'react';
import { GqlSorSwapType } from '~/apollo/generated/graphql-codegen-generated';
import { oldBnumToFixed } from '~/lib/services/pool/lib/old-big-number';
import { useDebouncedCallback } from 'use-debounce';
import { TradeChartSparkline } from './TradeChartSparkline';
import { useGetTokens } from '~/lib/global/useToken';

const buyAmountVar = makeVar<AmountHumanReadable>('');
const sellAmountVar = makeVar<AmountHumanReadable>('');
const tokenSelectedVar = makeVar<'tokenIn' | 'tokenOut'>('tokenIn');

export function useTradeCard() {
    const {
        reactiveTradeState,
        loadSwaps: _loadSwaps,
        loadingSwaps,
        setPreviewVisible,
        clearSwaps,
        setTradeConfig,
        getLatestState,
        setTokens,
        networkStatus,
    } = useTrade();

    // refetching the swaps may not always trigger the query loading state,
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

    useEffect(() => {
        //TODO: load token in/out from url if passed in
    }, []);

    const fetchTrade = async (type: GqlSorSwapType, amount: string) => {
        setTradeConfig(type, amount);
        setPreviewVisible(false);

        const trade = await _loadSwaps(type, amount);
        const resultAmount = trade?.returnAmount || '0';
        const resultAmountFixed = resultAmount ? oldBnumToFixed(resultAmount, 6) : '';

        if (type === 'EXACT_IN') {
            setBuyAmount(resultAmountFixed);
        } else {
            setSellAmount(resultAmountFixed);
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

    const handleTokenSelected = (address: string) => {
        const tokenSelectKey = tokenSelectedVar();
        const sellAmount = sellAmountVar();

        setTokens({ [tokenSelectKey]: address });

        if (parseFloat(sellAmount || '0') > 0) {
            setIsFetching.on();
            dFetchTrade('EXACT_IN', sellAmount);
        }
    };

    const handleTokensSwitched = () => {
        const state = getLatestState();
        const sellAmount = sellAmountVar();
        const buyAmount = buyAmountVar();

        setTokens({ tokenIn: state.tokenOut, tokenOut: state.tokenIn });
        setBuyAmount(sellAmount);
        setSellAmount(buyAmount);
    };

    const handleReviewClicked = () => {
        setPreviewVisible(true);
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
        setTokenSelectKey,
        handleTokenSelected,
        handleSellAmountChanged,
        handleBuyAmountChanged,
        handleTokensSwitched,
        handleReviewClicked,
        refetchTrade,
        setSellAmount,
        setBuyAmount,
    };
}

function TradeCard2() {
    const controls = useAnimation();
    const [showTokenSelect, setShowTokenSelect] = useBoolean();
    const {
        sellAmount,
        buyAmount,
        isLoadingOrFetching,
        tokenSelectKey,
        tokenIn,
        tokenOut,
        setTokenSelectKey,
        handleTokenSelected,
        handleBuyAmountChanged,
        handleSellAmountChanged,
        handleTokensSwitched,
        handleReviewClicked,
        refetchTrade,
        sorResponse,
        setBuyAmount,
        setSellAmount,
    } = useTradeCard();
    const { getToken } = useGetTokens();

    const isReviewDisabled = parseFloat(sellAmount || '0') === 0.0 || parseFloat(buyAmount || '0') === 0.0;

    const toggleTokenSelect = (tokenKey: 'tokenIn' | 'tokenOut') => () => {
        setShowTokenSelect.toggle();
        setTokenSelectKey(tokenKey);
        if (!showTokenSelect) {
            controls.set({ position: 'absolute', top: '0', height: 'fit-content' });
            controls.start({
                scale: 0.9,
                opacity: 0,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                },
            });
        } else {
            controls.set({
                translateX: '0px',
                translateY: '0px',
                opacity: 1,
                position: 'absolute',
            });
            controls.start({
                scale: 1,
                opacity: 1,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                },
            });
        }
    };

    return (
        <Box width="full" position="relative">
            <Card
                animate={controls}
                title="Swap"
                position="relative"
                shadow="lg"
                topRight={
                    sorResponse ? (
                        <Button
                            position="absolute"
                            height="fit-content"
                            borderRadius="full"
                            variant="ghost"
                            color="gray.200"
                            _hover={{ color: 'beets.cyan' }}
                            _active={{ backgroundColor: 'gray.300' }}
                            _focus={{ outline: 'none' }}
                            padding="2"
                            right=".5rem"
                            onClick={() => refetchTrade()}
                        >
                            <RefreshCcw size={24} />
                        </Button>
                    ) : null
                }
            >
                <VStack spacing="3" padding="4" width="full">
                    {/* <TradeChartSparkline /> */}
                    <Box position="relative" width="full">
                        <TokenInput
                            label={`Sell ${getToken(tokenIn)?.name || ''}`}
                            address={tokenIn}
                            toggleTokenSelect={toggleTokenSelect('tokenIn')}
                            onChange={handleSellAmountChanged}
                            value={sellAmount}
                            showPresets
                        />
                    </Box>
                    <TokenInputSwapButton onSwap={handleTokensSwitched} isLoading={isLoadingOrFetching} />
                    <TokenInput
                        label={`Receive ${getToken(tokenOut)?.name || ''}`}
                        address={tokenOut}
                        toggleTokenSelect={toggleTokenSelect('tokenOut')}
                        onChange={handleBuyAmountChanged}
                        value={buyAmount}
                    />
                    <Box width="full" paddingTop="2">
                        <BeetsButton
                            disabled={isReviewDisabled}
                            onClick={handleReviewClicked}
                            isFullWidth
                            size="md"
                            fontSize="1rem"
                        >
                            Review Swap
                        </BeetsButton>
                    </Box>
                    <Divider />
                    <TradeCardSwapBreakdown />
                </VStack>
            </Card>
            <AnimatePresence>
                {showTokenSelect && (
                    <TokenSelect onTokenSelected={handleTokenSelected} onClose={toggleTokenSelect(tokenSelectKey)} />
                )}
            </AnimatePresence>
        </Box>
    );
}
export default TradeCard2;
