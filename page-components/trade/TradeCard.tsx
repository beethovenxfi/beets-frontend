import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { useBoolean } from '@chakra-ui/hooks';
import { ChevronsDown } from 'react-feather';
import { useState } from 'react';
import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import { useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';
import { useGetSwaps } from './tradeState';
import { TokenInputSwapButton } from '~/page-components/trade/TokenInputSwapButton';
/*import { TokenInputSwapButton } from './TokenInputSwapButton';*/

function TradeCard() {
    const theme = useTheme();
    const controls = useAnimation();
    const { data, loading, error } = useGetTokenPricesQuery();
    const { tradeState } = useGetSwaps();

    const [showTokenSelect, setShowTokenSelect] = useBoolean();
    const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn');

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

    const handleTokenSelected = (address: string) => {
        tradeState[tokenSelectKey] = address;
    };

    return (
        <Box width="full" position="relative">
            <Card animate={controls} title="Market Swap" position="relative" height="md" shadow="lg" paddingBottom="1">
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput
                            address={tradeState.tokenIn}
                            toggleTokenSelect={toggleTokenSelect('tokenIn')}
                            label="Sell"
                        />
                        <TokenInputSwapButton />
                    </Box>
                    <TokenInput
                        address={tradeState.tokenOut}
                        toggleTokenSelect={toggleTokenSelect('tokenOut')}
                        label="Buy"
                    />
                    <BeetsButton isFullWidth size="lg">
                        Preview
                    </BeetsButton>
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
