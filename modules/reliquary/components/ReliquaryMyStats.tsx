import { HStack, Text, VStack, Grid, GridItem, Badge } from '@chakra-ui/react';
import React from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import Card from '~/components/card/Card';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';

const infoButtonLabelProps = {
    lineHeight: '1rem',
    fontWeight: 'semibold',
    fontSize: 'sm',
    color: 'beets.base.50',
};

export default function ReliquaryMyStats() {
    return (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6">
            <GridItem w="full">
                <Card px="2" py="4" height="full">
                    <VStack spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            My APR
                        </Text>
                        <Text color="beets.green" fontSize="2.5rem" fontWeight="900">
                            11.86%
                        </Text>
                        {/* <AprTooltip onlySparkles data={data.apr} /> */}
                        <HStack
                            px="3"
                            py="0.5"
                            rounded="md"
                            backgroundColor="beets.light"
                            width={{ base: 'min-content' }}
                            whiteSpace="nowrap"
                        >
                            <Text fontWeight="semibold">Maturity boost</Text>
                            <Badge bg="none" colorScheme="green" p="1">
                                100x
                            </Badge>
                        </HStack>
                    </VStack>
                </Card>
            </GridItem>
            <GridItem w="100%">
                <Card px="2" py="4" height="full">
                    <VStack spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            My Liquidity
                        </Text>
                        <Text color="white" fontSize="1.75rem">
                            {numberFormatUSDValue(20234.25)}
                        </Text>
                        <HStack spacing="1" mb="0.5" key="1">
                            <TokenAvatar
                                height="20px"
                                width="20px"
                                address="0xf24bcf4d1e507740041c9cfd2dddb29585adce1e"
                            />
                            <Text fontSize="1rem" lineHeight="1rem">
                                {numeral(242123).format('0,0')} BEETS
                            </Text>
                        </HStack>
                        <HStack spacing="1" mb="0.5" key="1">
                            <TokenAvatar
                                height="20px"
                                width="20px"
                                address="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
                            />
                            <Text fontSize="1rem" lineHeight="1rem">
                                {numeral(42123).format('0,0')} FTM
                            </Text>
                        </HStack>
                    </VStack>
                </Card>
            </GridItem>
            <GridItem w="100%">
                <Card px="2" py="4" height="full">
                    <VStack h="full" spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            My pending rewards
                        </Text>
                        <Text color="white" fontSize="1.75rem">
                            {numberFormatUSDValue(234.25)}
                        </Text>
                        <HStack spacing="1" mb="0.5" key="1">
                            <TokenAvatar
                                height="20px"
                                width="20px"
                                address="0xf24bcf4d1e507740041c9cfd2dddb29585adce1e"
                            />
                            <Text fontSize="1rem" lineHeight="1rem">
                                {numeral(242123).format('0,0')} BEETS
                            </Text>
                        </HStack>
                        <Text lineHeight="1rem" fontSize="sm" color="beets.base.50">
                            Select your relics to claim rewards
                        </Text>
                    </VStack>
                </Card>
            </GridItem>
            <GridItem w="100%">
                <Card px="2" py="4" height="full">
                    <VStack h="full" spacing="0" alignItems="flex-start">
                        <InfoButton
                            labelProps={infoButtonLabelProps}
                            label="Average relic level"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                        <Text color="white" fontSize="1.75rem">
                            3.2/11
                        </Text>
                        <Text lineHeight="1rem" fontSize="1rem" color="beets.base.50">
                            2 relics minted
                        </Text>
                        <Text lineHeight="1rem" fontSize="sm" color="beets.base.50">
                            Next level up: 2d:3h:14m:12s
                        </Text>
                    </VStack>
                </Card>
            </GridItem>
        </Grid>
    );
}
