import { Button, HStack, ListItem, Text, UnorderedList, VStack, Stack, Heading, Box } from '@chakra-ui/react';
import React from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { RelicCarousel } from './components/RelicCarousel';
import Rq1Image from '~/assets/images/rq-1.png';
import Rq2Image from '~/assets/images/rq-2.png';
import Rq3Image from '~/assets/images/rq-3.png';
import Image from 'next/image';
import { RelicStats } from './components/RelicStats';
import useReliquary from './lib/useReliquary';
import { PoolInvestModal } from '../pool/invest/PoolInvestModal';

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
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
    {
        src: Rq2Image,
        alt: 'Reliquary',
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
    {
        src: Rq3Image,
        alt: 'fBEETS',
        info: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet',
    },
];

export default function ReliquaryLanding() {
    const { relicPositions, selectedRelicId } = useReliquary();

    return (
        <Stack direction="column">
            <Stack bg="blackAlpha.500" px="8" py="20" direction={['column', 'row']} spacing="12">
                <VStack alignItems="flex-start" justifyContent="space-between">
                    <Text color="beets.green" fontSize="sm">
                        rfBEETS
                    </Text>
                    <Heading color="white" fontSize={{ base: 'lg', lg: '2rem' }}>
                        Extraordinary earnings & voting power
                    </Heading>
                    <UnorderedList pl="5">
                        <ListItem>Consectetur adipiscing elit</ListItem>
                        <ListItem>Integer molestie lorem at massa</ListItem>
                        <ListItem>Facilisis in pretium nisl aliquet</ListItem>
                    </UnorderedList>
                    <HStack w="90%">
                        <PoolInvestModal createRelic />
                        <Button variant="secondary" w="full">
                            Learn more
                        </Button>
                    </HStack>
                </VStack>
                <Stack direction={['column', 'row']} spacing="8">
                    {rqImages.map((image, index) => (
                        <VStack key={index}>
                            <Image src={image.src} alt={image.alt} placeholder="blur" style={{ borderRadius: '8px' }} />
                            <InfoButton labelProps={infoButtonLabelProps} label={image.alt} infoText={image.info} />
                        </VStack>
                    ))}
                </Stack>
            </Stack>
            <VStack py="4" spacing="8" shadow="lg">
                <VStack>
                    <Heading size="lg">Your relics</Heading>
                    {relicPositions.length > 0 && <Text>Click on a relic to see more detailed information.</Text>}
                    {relicPositions.length === 0 && (
                        <VStack spacing="4">
                            <Text>Looks like you don't have a relic yet. Let's get started by creating one.</Text>
                            <PoolInvestModal activatorLabel="Create Relic" />
                        </VStack>
                    )}
                </VStack>
                <Box width="full">
                    <RelicCarousel />
                </Box>
            </VStack>
            {selectedRelicId && (
                <Box py="8">
                    <RelicStats />
                </Box>
            )}
            {/* <HStack>
                {relicPositions.map((position, index) => (
                    <Text key={index} onClick={() => setSelectedRelicId(position.relicId)}>
                        {position.relicId}
                    </Text>
                ))}
            </HStack> */}
        </Stack>
    );
}
