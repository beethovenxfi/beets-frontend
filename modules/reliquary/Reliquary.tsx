import { Box, Button, Flex, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { animate, AnimatePresence, AnimateSharedLayout, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import SwitchButton from '~/components/switch-button/SwitchButton';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { PoolInvestCustom } from '../pool/invest/components/PoolInvestCustom';
import { PoolInvestPreview } from '../pool/invest/components/PoolInvestPreview';
import { PoolInvestProportional } from '../pool/invest/components/PoolInvestProportional';
import ReliquaryCard from './components/ReliquaryCard';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';
import ReliquaryInvest from './components/ReliquaryInvest';
import ReliquaryNFT from './components/ReliquaryNFT';
import useReliquary from './hooks/useReliquary';

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
        <Box minHeight="600px" display="flex" alignItems="center" justifyContent={{ md: 'center', xl: 'initial' }}>
            <AnimatePresence>
                {!isConnected && <ReliquaryConnectWallet />}
                {isConnected && (
                    <HStack
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        width="100%"
                        alignItems="flex-start"
                    >
                        <Flex justifyContent="center" alignItems="flex-start" width="100%" height="100%">
                            {/* TODO SPLIT COMPONENTS UP */}
                            <VStack spacing="8">
                                {relicPositions.length > 0 && <ReliquaryNFT />}
                                {relicPositions.length === 0 && (
                                    <VStack spacing="4">
                                        <VStack spacing="2">
                                            <Heading fontSize="1.75rem">Get your first relic</Heading>
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
