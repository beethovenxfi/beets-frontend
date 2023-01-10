import { Button, HStack, ListItem, Text, UnorderedList, VStack, Stack } from '@chakra-ui/react';
import React from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { RelicCarousel } from './components/RelicCarousel';
import ReliquaryMyStats from './components/ReliquaryMyStats';
import Rq1Image from '~/assets/images/rq-1.png';
import Rq2Image from '~/assets/images/rq-2.png';
import Rq3Image from '~/assets/images/rq-3.png';
import Image from 'next/image';

const buttonWidth = {
    base: 'full',
    md: '140px',
};

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
    return (
        <Stack direction="column">
            <Stack direction={['column', 'row']} alignItems="stretch" mb="16">
                <VStack alignItems="flex-start" justifyContent="space-between" mr="16" mb={{ base: 4, lg: undefined }}>
                    <Text color="beets.green" fontSize="sm">
                        rfBEETS
                    </Text>
                    <Text
                        color="white"
                        as="h2"
                        textStyle={{ base: undefined, lg: 'h2' }}
                        fontSize={{ base: 'lg', lg: undefined }}
                    >
                        Extraordinary earnings & voting power
                    </Text>
                    <UnorderedList pl="5">
                        <ListItem>Consectetur adipiscing elit</ListItem>
                        <ListItem>Integer molestie lorem at massa</ListItem>
                        <ListItem>Facilisis in pretium nisl aliquet</ListItem>
                    </UnorderedList>
                    <HStack>
                        <Button variant="primary" width={buttonWidth}>
                            Get rfBEETS
                        </Button>
                        <Button variant="secondary" width={buttonWidth}>
                            Learn more
                        </Button>
                    </HStack>
                </VStack>
                <Stack direction={['column', 'row']} spacing="8">
                    {rqImages.map((image, index) => (
                        // TODO: why is the 'mb' style overwritten for the seconf & third image?
                        <VStack key={index} mb={{ base: 4, lg: undefined }}>
                            <Image src={image.src} alt={image.alt} placeholder="blur" style={{ borderRadius: '8px' }} />
                            <InfoButton labelProps={infoButtonLabelProps} label={image.alt} infoText={image.info} />
                        </VStack>
                    ))}
                </Stack>
            </Stack>
            <RelicCarousel />
            <ReliquaryMyStats />
        </Stack>
    );
}
