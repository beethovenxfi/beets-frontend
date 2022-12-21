import { Heading, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';

interface Props {}

export default function ReliquaryConnectWallet(props: Props) {
    return (
        <VStack
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            exit={{ opacity: 0 }}
            spacing="4"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
        >
            <VStack spacing="1">
                <Heading fontSize="1.75rem">Welcome to the Beets Reliquary</Heading>
                <Text fontSize="1.15rem">Connect your wallet to get started.</Text>
            </VStack>
            <WalletConnectButton
                as={motion.button}
                initial={{ transform: 'scale(0.2)', opacity: 0 }}
                animate={{
                    transform: 'scale(1)',
                    transition: { delay: 1.5, type: 'spring', mass: 0.05, stiffness: 700 },
                    opacity: 1,
                }}
                exit={{ transform: 'scale(0)', opacity: 0 }}
            />
        </VStack>
    );
}
