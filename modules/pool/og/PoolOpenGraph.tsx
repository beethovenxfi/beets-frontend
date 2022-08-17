import { Box, Divider, Flex, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import PoolHeaderOpenGraph from '~/modules/pool/og/PoolHeaderOpenGraph';
import Card from '~/components/card/Card';
import { CardRow } from '~/components/card/CardRow';
import { usePool } from '../lib/usePool';
import { format, formatDistanceToNow } from 'date-fns';
import { PoolDetailUsdStatsWithDate } from '../detail/components/PoolDetailUsdStatsWithDate';
import { numberFormatLargeUsdValue, numberFormatLargeValue } from '~/lib/util/number-formats';
import NextImage from 'next/image';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import DegenBand from '~/assets/images/degen-band.png';
import FooterImageOp from '~/assets/images/footer-OP.png';
import Head from 'next/head';

export function PoolOpenGraph() {
    const { pool } = usePool();
    const dynamicData = pool.dynamicData;
    const sharePrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);
    const { chainId } = useNetworkConfig();

    return (
        <>
            <Grid
                templateColumns={'2fr 1fr'}
                templateAreas={`"details stats"
               "image stats"`}
                gap="4"
                width="1200px"
                height="630px"
                id="og"
                p="50px"
            >
                <GridItem area="details">
                    <PoolHeaderOpenGraph />
                </GridItem>
                <GridItem area="image">
                    <NextImage src={chainId === '10' ? FooterImageOp : DegenBand} width="472px" height="394.8px" />
                </GridItem>
                <GridItem area="stats">
                    <Card padding="2" mb="8">
                        <CardRow>
                            <Box flex="1" fontWeight="semibold">
                                Created
                            </Box>
                            <VStack spacing="0" alignItems="flex-end">
                                <Box>{format(new Date(pool.createTime * 1000), 'MMM. d, yyyy')}</Box>
                                <Box fontSize="sm" color="gray.200">
                                    {formatDistanceToNow(new Date(pool.createTime * 1000))} old
                                </Box>
                            </VStack>
                        </CardRow>
                        <CardRow flexDirection="column">
                            <Box fontWeight="semibold">Lifetime stats</Box>
                            <Box ml="4" mt="2">
                                <Flex>
                                    <Box flex="1">Volume</Box>
                                    <Box>{numberFormatLargeUsdValue(dynamicData.lifetimeVolume)}</Box>
                                </Flex>
                                <Divider mt="1.5" mb="1.5" />
                                <Flex>
                                    <Box flex="1">Swap fees</Box>
                                    <Box>{numberFormatLargeUsdValue(dynamicData.lifetimeSwapFees)}</Box>
                                </Flex>
                                <Divider mt="1.5" mb="1.5" />
                                <Flex>
                                    <Box flex="1">Swaps</Box>
                                    <Box>{numberFormatLargeValue(dynamicData.swapsCount)}</Box>
                                </Flex>
                            </Box>
                        </CardRow>
                        <PoolDetailUsdStatsWithDate
                            title="BPT price"
                            stats={[
                                {
                                    label: 'All-time high',
                                    value: dynamicData.sharePriceAth,
                                    currentValue: sharePrice,
                                    timestamp: dynamicData.sharePriceAthTimestamp,
                                },
                                {
                                    label: 'All-time low',
                                    value: dynamicData.sharePriceAtl,
                                    currentValue: sharePrice,
                                    timestamp: dynamicData.sharePriceAtlTimestamp,
                                },
                            ]}
                        />
                        {/* <PoolDetailUsdStatsWithDate
                        title="24h volume"
                        stats={[
                            {
                                label: 'All-time high',
                                value: dynamicData.volume24hAth,
                                currentValue: dynamicData.volume24h,
                                timestamp: dynamicData.volume24hAthTimestamp,
                            },
                            {
                                label: 'All-time low',
                                value: dynamicData.volume24hAtl,
                                currentValue: dynamicData.volume24h,
                                timestamp: dynamicData.volume24hAtlTimestamp,
                            },
                        ]}
                    /> */}
                        <PoolDetailUsdStatsWithDate
                            title="Total liquidity"
                            stats={[
                                {
                                    label: 'All-time high',
                                    value: dynamicData.totalLiquidityAth,
                                    currentValue: dynamicData.totalLiquidity,
                                    timestamp: dynamicData.totalLiquidityAthTimestamp,
                                },
                            ]}
                        />

                        <CardRow mb="0">
                            <Box flex="1" fontWeight="semibold">
                                Number of investors
                            </Box>
                            <Box>{numberFormatLargeValue(dynamicData.holdersCount)}</Box>
                        </CardRow>
                    </Card>
                </GridItem>
            </Grid>
        </>
    );
}
