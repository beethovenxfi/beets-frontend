import {
    Button,
    HStack,
    ListItem,
    Text,
    UnorderedList,
    VStack,
    Image,
    Grid,
    GridItem,
    Stack,
    Badge,
} from '@chakra-ui/react';
import React from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import Card from '~/components/card/Card';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import ReliquaryMyStats from './components/ReliquaryMyStats';

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

export default function ReliquaryLanding() {
    return (
        <Stack direction="column">
            <Stack direction={['column', 'row']} alignItems="stretch" mb="16">
                <VStack alignItems="flex-start" justifyContent="space-between" mr="16">
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
                <Stack direction={['column', 'row']}>
                    <VStack>
                        <Image borderRadius="xl" src="https://via.placeholder.com/400" alt="placeholder" />
                        <InfoButton
                            labelProps={infoButtonLabelProps}
                            label="fBEETS"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                    </VStack>
                    <VStack>
                        <Image borderRadius="xl" src="https://via.placeholder.com/400" alt="placeholder" />
                        <InfoButton
                            labelProps={infoButtonLabelProps}
                            label="Reliquary"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                    </VStack>
                    <VStack>
                        <Image borderRadius="xl" src="https://via.placeholder.com/400" alt="placeholder" />
                        <InfoButton
                            labelProps={infoButtonLabelProps}
                            label="rfBEETS"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                    </VStack>
                </Stack>
            </Stack>
            <ReliquaryMyStats />
        </Stack>
    );
}
