import { Box, useDisclosure, VStack } from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';
import { TokenInputSwapButton } from '~/modules/trade/components/TokenInputSwapButton';
import { TradeCardSwapBreakdown } from '~/modules/trade/components/TradeCardSwapBreakdown';
import { RefreshCcw } from 'react-feather';
import { Button } from '@chakra-ui/button';
import { useTradeCard } from '~/modules/trade/lib/useTradeCard';
import { TokenSelectModal } from '~/components/token-select/TokenSelectModal';

export function TradeCard() {
    const controls = useAnimation();
    //const [showTokenSelect, setShowTokenSelect] = useBoolean();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        sellAmount,
        buyAmount,
        isLoadingOrFetching,
        tokenIn,
        tokenOut,
        setTokenSelectKey,
        handleBuyAmountChanged,
        handleSellAmountChanged,
        handleTokensSwitched,
        handleReviewClicked,
        refetchTrade,
        sorResponse,
    } = useTradeCard();

    const isReviewDisabled = parseFloat(sellAmount || '0') === 0.0 || parseFloat(buyAmount || '0') === 0.0;

    function showTokenSelect(tokenKey: 'tokenIn' | 'tokenOut') {
        setTokenSelectKey(tokenKey);
        onOpen();
    }

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
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput
                            label="Sell"
                            address={tokenIn}
                            toggleTokenSelect={() => showTokenSelect('tokenIn')}
                            onChange={handleSellAmountChanged}
                            value={sellAmount}
                            showPresets
                        />
                    </Box>
                    <TokenInputSwapButton onSwap={handleTokensSwitched} isLoading={isLoadingOrFetching} />
                    <TokenInput
                        label="Buy"
                        address={tokenOut}
                        toggleTokenSelect={() => showTokenSelect('tokenOut')}
                        onChange={handleBuyAmountChanged}
                        value={buyAmount}
                    />
                    <Box width="full" paddingTop="2">
                        <BeetsButton disabled={isReviewDisabled} onClick={handleReviewClicked} isFullWidth size="lg">
                            Review Swap
                        </BeetsButton>
                    </Box>
                </VStack>
                <TradeCardSwapBreakdown />
            </Card>
            <TokenSelectModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </Box>
    );
}
