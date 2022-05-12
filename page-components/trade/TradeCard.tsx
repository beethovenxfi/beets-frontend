import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { ChevronsDown } from 'react-feather';
import { useRef, useState } from 'react';
import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import { useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';
import { useGetSwaps } from './tradeState';
import TokenInputSwapTrigger from './TokenSelectTrigger';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();
    const controls = useAnimation();
    const { tradeState } = useGetSwaps();
    const theme = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);

    const toggleTokenSelect = async (isVisible: boolean) => {
        // if (isVisible) {
        //     controls.set({ position: 'absolute', top: '0', height: 'fit-content' });
        //     controls.start({
        //         scale: 0.9,
        //         // opacity: 0,
        //         transition: {
        //             type: 'spring',
        //             stiffness: 400,
        //             damping: 30,
        //         },
        //     });
        // } else {
        //     controls.set({
        //         translateX: '0px',
        //         translateY: '0px',
        //         opacity: 1,
        //         position: 'absolute',
        //     });
        //     controls.start({
        //         scale: 1,
        //         opacity: 1,
        //         transition: {
        //             type: 'spring',
        //             stiffness: 400,
        //             damping: 30,
        //         },
        //     });
        // }
    };
    return (
        <Box width="full" position="relative" ref={cardRef as any}>
            <Card animate={controls} title="Market Swap" position="relative" height="md" shadow="lg" paddingBottom="1">
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput containerRef={cardRef} onToggleTokenSelect={toggleTokenSelect} label="Sell" />
                        <TokenInputSwapTrigger />
                    </Box>
                    <TokenInput containerRef={cardRef} onToggleTokenSelect={toggleTokenSelect} label="Buy" />
                    <BeetsButton isFullWidth size="lg">
                        Preview
                    </BeetsButton>
                </VStack>
            </Card>
        </Box>
    );
}
export default TradeCard;
