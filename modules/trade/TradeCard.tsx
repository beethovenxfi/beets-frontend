import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { useBoolean } from '@chakra-ui/hooks';
import { ChevronsDown } from 'react-feather';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import { useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';
import { useGetSwaps } from './tradeState';
import { TokenInputSwapButton } from '~/modules/trade/TokenInputSwapButton';
import { useGetTokens } from '~/lib/global/useToken';
import { useDebouncedCallback } from 'use-debounce';
import { formatUnits } from '@ethersproject/units';

function useTradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();
    const { tradeState, loadSwaps: _loadSwaps, loadingSwaps } = useGetSwaps();
    const { tokens, getToken } = useGetTokens();

    // refetching the swaps may not always trigger the query loading state,
    // so we use a fallback flag to make sure that we always have some loading
    // even if the query is retrieving the 'same' value from the cache.
    const [isFetching, setIsFetching] = useBoolean();
    const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn');

    const [sellAmount, setSellAmount] = useState('0');
    const [buyAmount, setBuyAmount] = useState('0');

    const isLoadingOrFetching = loading || isFetching;

    useEffect(() => {
        tradeState.tokenIn = tradeState.tokenIn || tokens[0].address;
        tradeState.tokenOut = tradeState.tokenOut || tokens[1].address;
    });

    const fetchTrade = async (type: 'EXACT_IN' | 'EXACT_OUT', amount: string) => {
        tradeState.swapType = 'EXACT_IN';
        tradeState.swapAmount = amount;

        setIsFetching.on();
        const trade = await _loadSwaps();
        const resultAmount = formatUnits(trade?.returnAmount || 0, getToken(tradeState.tokenIn || '')?.decimals);

        if (type === 'EXACT_IN') {
            setBuyAmount(resultAmount);
        } else {
            setSellAmount(resultAmount);
        }
        setIsFetching.off();
    };

    const dFetchTrade = useDebouncedCallback((type: 'EXACT_IN' | 'EXACT_OUT', amount: string) => {
        fetchTrade(type, amount);
    }, 300);

    const handleSellAmountChanged = async (event: FormEvent<HTMLInputElement>) => {
        const amount = event.currentTarget.value;
        dFetchTrade('EXACT_IN', amount);
        setSellAmount(amount);
    };

    const handleBuyAmountChanged = async (event: FormEvent<HTMLInputElement>) => {
        const amount = event.currentTarget.value;
        dFetchTrade('EXACT_OUT', amount);
        setBuyAmount(amount);
    };

    const handleTokenSelected = (address: string) => {
        tradeState[tokenSelectKey] = address;
    };

    const handleTokensSwitched = () => {
        const sellTokenBeforeSwitch = tradeState.tokenIn;
        const sellAmountBeforeSwitch = sellAmount;

        tradeState.tokenIn = tradeState.tokenOut;
        tradeState.tokenOut = sellTokenBeforeSwitch;

        setBuyAmount(sellAmount);
        setSellAmount(buyAmount);
    };

    return {
        tokenIn: tradeState.tokenIn,
        tokenOut: tradeState.tokenOut,
        tokenSelectKey,
        sellAmount,
        buyAmount,
        isLoadingOrFetching,
        setTokenSelectKey,
        handleTokenSelected,
        handleSellAmountChanged,
        handleBuyAmountChanged,
        handleTokensSwitched,
    };
}

// for daniel when you read this
// the motivation here is to keep the 'view' layer as readable as possible
// but also keep the logic behind it as readable as possible.
// so, the idea here is from that motivation of 'view as function of state'
// the state being the 'useTradeCard' composable.
// seperation of concerns I guess, lemme know what you think
function TradeCard() {
    const controls = useAnimation();
    const [showTokenSelect, setShowTokenSelect] = useBoolean();

    const {
        tokenIn,
        tokenOut,
        sellAmount,
        buyAmount,
        isLoadingOrFetching,
        tokenSelectKey,
        setTokenSelectKey,
        handleTokenSelected,
        handleBuyAmountChanged,
        handleSellAmountChanged,
        handleTokensSwitched,
    } = useTradeCard();

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
            <Card animate={controls} title="Market Swap" position="relative" height="md" shadow="lg">
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput
                            label="Sell"
                            address={tokenIn}
                            toggleTokenSelect={toggleTokenSelect('tokenIn')}
                            onChange={handleSellAmountChanged}
                            value={sellAmount}
                        />
                        <TokenInputSwapButton onSwap={handleTokensSwitched} isLoading={isLoadingOrFetching} />
                    </Box>
                    <TokenInput
                        label="Buy"
                        address={tokenOut}
                        toggleTokenSelect={toggleTokenSelect('tokenOut')}
                        onChange={handleBuyAmountChanged}
                        value={buyAmount}
                    />
                    <Box width="full" paddingTop="2">
                        <BeetsButton isFullWidth size="lg">
                            Preview
                        </BeetsButton>
                    </Box>
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
export default TradeCard;
