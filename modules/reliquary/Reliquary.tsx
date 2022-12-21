import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { animate, AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useState } from 'react';
import { useUserAccount } from '~/lib/user/useUserAccount';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';
import ReliquaryInvest from './components/ReliquaryInvest';
import useReliquary from './hooks/useReliquary';
import { RelicContainer } from '~/modules/reliquary/components/RelicContainer';

interface Props {}

export default function Reliquary(props: Props) {
    const { relicPositions, isLoadingRelicPositions, depositableBalance, isLoading } = useReliquary();
    const inputAnimation = useAnimation();
    const { isConnected } = useUserAccount();
    const bpt = useMotionValue(5);
    const [bptInput, setBptInput] = useState(0);
    const [inputWidth, setInputWidth] = useState(0);
    const [investmentStep, setInvestmentStep] = useState('proportional');

    const setMaxBpt = () => {
        const maxValue = parseFloat(parseFloat(depositableBalance).toFixed(4));
        let width = parseFloat(depositableBalance).toFixed(4).length;
        if (width === 1) {
            width = width * 2;
        } else if (width === 2) {
            width = width * 1.5;
        } else if (width > 2 && width < 8) {
            width = width * 1.1;
        }
        inputAnimation.start({
            width: `${width}ch`,
        });
        animate(bpt, maxValue, {
            type: 'spring',
            mass: 0.1,
            stiffness: 150,
            onUpdate: (value) => {
                setBptInput(parseFloat(value.toFixed(4)));
            },
        });
    };

    const updateBptInput = (event: any) => {
        setBptInput(event.target.value);
        let width = event.target.value.length;
        if (width === 1) {
            width = width * 2;
        } else if (width === 2) {
            width = width * 1.5;
        } else if (width > 2 && width < 8) {
            width = width * 1.1;
        }
        inputAnimation.start({
            width: `${width}ch`,
        });
        bpt.set(parseFloat(event.target.value));
    };

    return (
        <Box
            minHeight="800px"
            width="full"
            display="flex"
            height="full"
            alignItems="center"
            justifyContent={{ md: 'center', xl: 'initial' }}
        >
            <AnimatePresence>
                {!isConnected && <ReliquaryConnectWallet />}
                {isConnected && (
                    <HStack
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        width="full"
                        height="full"
                        alignItems="flex-start"
                    >
                        <Flex justifyContent="center" alignItems="flex-start" width="full" height="full">
                            <VStack spacing="8" width="full" height="full">
                                {relicPositions.length > 0 && <RelicContainer />}
                                {relicPositions.length === 0 && (
                                    <VStack spacing="4">
                                        <VStack spacing="2">
                                            <Heading fontSize="1.75rem">Mint your first relic</Heading>
                                            <Text fontSize="1.15rem">
                                                Looks like you don't have a relic yet. Let's get started by investing
                                                into fBEETS.
                                            </Text>
                                        </VStack>
                                        <ReliquaryInvest onInvestComplete={() => false} />
                                    </VStack>
                                )}
                            </VStack>
                        </Flex>
                    </HStack>
                )}
            </AnimatePresence>
        </Box>
    );
}
