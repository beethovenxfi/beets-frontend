import {
    Button,
    HStack,
    ListItem,
    Text,
    UnorderedList,
    VStack,
    Stack,
    Heading,
    Box,
    Spacer,
    useDisclosure,
    Flex,
    Badge,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { RelicCarousel } from './components/RelicCarousel';
import Rq1Image from '~/assets/images/rq-1.png';
import Rq2Image from '~/assets/images/rq-2.png';
import Rq3Image from '~/assets/images/rq-3.png';
import Image from 'next/image';
import { ReliquaryInvestModal } from './invest/ReliquaryInvestModal';
import ReliquaryGlobalStats from './components/stats/ReliquaryGlobalStats';
import { motion } from 'framer-motion';
import { useUserAccount } from '~/lib/user/useUserAccount';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { TokensProvider } from '~/lib/global/useToken';
import { PoolProvider, usePool } from '../pool/lib/usePool';
import ReliquaryMigrateModal from './components/ReliquaryMigrateModal';
import { useLegacyFBeetsBalance } from './lib/useLegacyFbeetsBalance';
import { CurrentStepProvider } from './lib/useReliquaryCurrentStep';
import Compose, { ProviderWithProps } from '~/components/providers/Compose';
import useReliquary from './lib/useReliquary';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';

const infoButtonLabelProps = {
    lineHeight: '1rem',
    fontWeight: 'semibold',
    fontSize: 'sm',
    color: 'beets.base.50',
};

const rqImages = [
    {
        src: Rq1Image,
        alt: 'fBEETS',
        info: 'Invest BEETS/wFTM (80/20) into the Fresh BEETS pool to receive fBEETS.',
    },
    {
        src: Rq2Image,
        alt: 'Reliquary',
        info: 'Deposit fBEETS into Reliquary to unlock your maturity adjusted position.',
    },
    {
        src: Rq3Image,
        alt: 'maBEETS',
        info: 'Receive a transferable and composable Relic that holds your maturity adjusted BEETS (maBEETS) position.',
    },
];

export default function ReliquaryLanding() {
    const { isConnected, isConnecting } = useUserAccount();
    const { total } = useLegacyFBeetsBalance();
    const { showToast } = useToast();
    const { pool } = usePool();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const { totalMaBeets } = useReliquary();

    useEffect(() => {
        if (!isConnecting) {
            setButtonEnabled(isConnected);
        }
    }, [isConnected]);

    useEffect(() => {
        if (total > 0 && !isOpen) {
            showToast({
                id: 'migrate-fbeets',
                type: ToastType.Info,
                content: (
                    <Stack
                        direction={['column', 'row']}
                        spacing="4"
                        alignItems="center"
                        justifyContent={{ base: 'stretch', xl: undefined }}
                    >
                        <Text>You have a legacy fBEETS balance that can be migrated to maBEETS</Text>
                        <Button variant="primary" onClick={onOpen} w={{ base: 'full', xl: 'inherit' }}>
                            Migrate
                        </Button>
                    </Stack>
                ),
            });
        }
    }, [total, isOpen]);

    return (
        <>
            <Stack direction="column" width="full">
                <Stack
                    bg="blackAlpha.500"
                    px={{ base: '0', xl: '8' }}
                    pt={{ base: '8', xl: '20' }}
                    pb={{ base: '12', xl: '20' }}
                    direction={['column', 'row']}
                    spacing="12"
                    width="full"
                >
                    <VStack width="full" alignItems="flex-start">
                        <Heading color="white" fontSize={{ base: 'lg', lg: '2rem' }}>
                            Maturity adjusted voting power and BEETS rewards.
                        </Heading>
                        <UnorderedList pl="5">
                            <ListItem>Participate in BEETS governance</ListItem>
                            <ListItem>Unlock maturity adjusted rewards</ListItem>
                            <ListItem>Access evolving Ludwig fNFTs</ListItem>
                        </UnorderedList>
                        <Spacer />
                        <HStack w={{ base: 'full', xl: '90%' }}>
                            <ReliquaryInvestModal createRelic isConnected={buttonEnabled} />
                            <Button
                                variant="secondary"
                                w="full"
                                as="a"
                                href="https://docs.beets.fi/beets/mabeets"
                                target="_blank"
                            >
                                Learn more
                            </Button>
                        </HStack>
                    </VStack>
                    <Stack display={{ base: 'none', md: 'flex' }} direction={['column', 'row']} spacing="8">
                        {rqImages.map((image, index) => (
                            <VStack spacing="4" key={index}>
                                <Box
                                    as={motion.div}
                                    whileHover={{
                                        scale: 1.2,
                                        transition: { type: 'spring', stiffness: 400, damping: 10 },
                                    }}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        placeholder="blur"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Box>
                                <InfoButton labelProps={infoButtonLabelProps} label={image.alt} infoText={image.info} />
                            </VStack>
                        ))}
                    </Stack>
                </Stack>
                <Box width="full">
                    <VStack width="full" py="4" spacing="8">
                        {!isConnected && (
                            <VStack minH="200px" justifyContent="center" alignItems="center">
                                <ReliquaryConnectWallet />
                            </VStack>
                        )}
                        {isConnected && (
                            <>
                                <HStack spacing="4" width="full" position="relative">
                                    <Heading size="lg">My relics</Heading>
                                    <BeetsTooltip noImage label="Your total maBEETS across all of your relics.">
                                        <VStack pt="1" height="full">
                                            <Box height="full">
                                                <Badge rounded="md" colorScheme="orange" p="2">
                                                    <Heading textTransform="initial" textAlign="center" size="sm">
                                                        {totalMaBeets.toFixed(4)} maBEETS
                                                    </Heading>
                                                </Badge>
                                            </Box>
                                        </VStack>
                                    </BeetsTooltip>
                                </HStack>
                                <Box width="full">
                                    <RelicCarousel />
                                </Box>
                            </>
                        )}
                    </VStack>
                    <VStack width="full" py="4" spacing="8" mt={{ base: '32rem', lg: '16' }}>
                        <VStack width="full" alignItems="flex-start">
                            <Heading size="lg">All relics</Heading>
                        </VStack>
                        <ReliquaryGlobalStats />
                    </VStack>
                </Box>
            </Stack>
            <TokensProvider>
                <PoolProvider pool={pool}>
                    <CurrentStepProvider>
                        <ReliquaryMigrateModal isOpen={isOpen} onClose={onClose} />
                    </CurrentStepProvider>
                </PoolProvider>
            </TokensProvider>
        </>
    );
}
