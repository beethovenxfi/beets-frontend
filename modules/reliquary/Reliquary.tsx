import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { animate, AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useState } from 'react';
import { useUserAccount } from '~/lib/user/useUserAccount';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';
import ReliquaryInvest from './components/ReliquaryInvest';
import useReliquary from './lib/useReliquary';
import { Relic } from '~/modules/reliquary/components/Relic';

interface Props {}

export default function Reliquary(props: Props) {
    const { relicPositions, isLoadingRelicPositions, isLoading } = useReliquary();
    const inputAnimation = useAnimation();
    const { isConnected } = useUserAccount();

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
                                {relicPositions.length > 0 && <Relic />}
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
