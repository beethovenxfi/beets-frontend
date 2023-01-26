import { Button, HStack, ListItem, Text, UnorderedList, VStack, Stack, Heading, Box } from '@chakra-ui/react';
import React from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { RelicCarousel } from './components/RelicCarousel';
import Rq1Image from '~/assets/images/rq-1.png';
import Rq2Image from '~/assets/images/rq-2.png';
import Rq3Image from '~/assets/images/rq-3.png';
import Image from 'next/image';
import { PoolInvestModal } from '../pool/invest/PoolInvestModal';
import ReliquaryGlobalStats from './components/stats/ReliquaryGlobalStats';
import { motion } from 'framer-motion';
import { useUserAccount } from '~/lib/user/useUserAccount';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';

const infoButtonLabelProps = {
    lineHeight: '1rem',
    fontWeight: 'semibold',
    fontSize: 'sm',
    color: 'beets.base.50',
    marginTop: '4',
};

const rqImages = [
    {
        src: Rq1Image,
        alt: 'fBEETS',
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
    {
        src: Rq2Image,
        alt: 'Reliquary',
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
    {
        src: Rq3Image,
        alt: 'maBEETS',
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
];

export default function ReliquaryLanding() {
    const { isConnected } = useUserAccount();

    return (
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
                <VStack width="full" alignItems="flex-start" justifyContent="space-between">
                    <Text color="beets.green" fontSize="sm">
                        maBEETS
                    </Text>
                    <Heading color="white" fontSize={{ base: 'lg', lg: '2rem' }}>
                        A brand new primitive waiting to be explored.
                    </Heading>
                    <UnorderedList pl="5">
                        <ListItem>Participate in BEETS governance</ListItem>
                        <ListItem>Unlock maturity adjusted rewards</ListItem>
                        <ListItem>Access evolving Ludwig fNFTs</ListItem>
                    </UnorderedList>
                    <HStack w={{ base: 'full', xl: '90%' }}>
                        <PoolInvestModal createRelic />
                        <Button variant="secondary" w="full" as="a" href="https://docs.beets.fi" target="_blank">
                            Learn more
                        </Button>
                    </HStack>
                </VStack>
                <Stack direction={['column', 'row']} spacing="8">
                    {rqImages.map((image, index) => (
                        <VStack spacing="0" key={index}>
                            <Box
                                as={motion.div}
                                whileHover={{ scale: 1.2, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
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
                        <VStack minH="300px" justifyContent="center" alignItems="center">
                            <ReliquaryConnectWallet />
                        </VStack>
                    )}
                    {isConnected && (
                        <>
                            <VStack width="full" alignItems="flex-start">
                                <Heading size="lg">My maBEETS</Heading>
                            </VStack>
                            <Box width="full">
                                <RelicCarousel />
                            </Box>
                        </>
                    )}
                </VStack>
                <VStack width="full" py="4" spacing="8" mt={{ base: '32rem', lg: '16' }}>
                    <VStack width="full" alignItems="flex-start">
                        <Heading size="lg">Global maBEETS</Heading>
                    </VStack>
                    <ReliquaryGlobalStats />
                </VStack>
            </Box>
        </Stack>
    );
}
