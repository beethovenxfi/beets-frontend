import { Box, VStack } from '@chakra-ui/react';
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
import { useTradeCard } from '~/modules/trade/lib/useTradeCard';

function TradeCard() {
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
    } = useTradeCard();

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
                            color="beets.gray.200"
                            _hover={{ color: 'beets.highlight.alpha.100' }}
                            _active={{ backgroundColor: 'beets.gray.300' }}
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
                        <BeetsButton disabled={isReviewDisabled} onClick={handleReviewClicked} isFullWidth size="lg">
                            Review Swap
                        </BeetsButton>
                    </Box>
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
export default TradeCard;
