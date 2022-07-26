import { usePool } from '~/modules/pool/lib/usePool';
import { Box, Flex, Grid, GridItem, HStack, Link } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { ExternalLink } from 'react-feather';
import { CardRow } from '~/components/card/CardRow';
import { format, formatDistanceToNow } from 'date-fns';
import { addressShortDisplayName } from '~/lib/util/address';
import { etherscanGetAddressUrl } from '~/lib/util/etherscan';
import { numberFormatLargeUsdValue, numberFormatLargeValue } from '~/lib/util/number-formats';
import { Divider, VStack } from '@chakra-ui/layout';
import { PoolDetailUsdStatsWithDate } from '~/modules/pool/detail/components/PoolDetailUsdStatsWithDate';
import { TradeTokenDataCard } from '~/modules/trade/components/TradeTokenDataCard';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useGetTokens } from '~/lib/global/useToken';
import { useGetPoolTokensDynamicDataQuery } from '~/apollo/generated/graphql-codegen-generated';

export function PoolDetailAboutThisPool() {
    const { pool } = usePool();
    const tokensOfInterest = pool.withdrawConfig.options.map((option) => option.tokenOptions).flat();
    const dynamicData = pool.dynamicData;
    const sharePrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);
    const { priceFor } = useGetTokens();
    const { data } = useGetPoolTokensDynamicDataQuery({
        variables: { addresses: tokensOfInterest.map((token) => token.address) },
    });

    return (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4" width="full">
            <GridItem colSpan={2}>
                <Card padding="2" pt="4" width="full" title="Pool tokens">
                    {tokensOfInterest.map((token, index) => {
                        return (
                            <TradeTokenDataCard
                                key={index}
                                token={token}
                                price={priceFor(token.address)}
                                data={data?.staticData.find((item) => item.tokenAddress === token.address)}
                                dynamicData={data?.dynamicData.find((item) => item.tokenAddress === token.address)}
                                flex={1}
                                mb="1"
                            />
                        );
                    })}
                    {/*<TradeTokenDataCard
                        token={tokenIn}
                        price={priceFor(tokenIn.address)}
                        data={tokenInData}
                        dynamicData={tokenInDynamicData}
                        flex={1}
                    />*/}
                </Card>
            </GridItem>
            <GridItem>
                <Card padding="2" pt="4" title="Pool statistics" height="auto" mb="4">
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
                    <PoolDetailUsdStatsWithDate
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
                    />
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

                    <CardRow>
                        <Box flex="1" fontWeight="semibold">
                            Number of investors
                        </Box>
                        <Box>{numberFormatLargeValue(dynamicData.holdersCount)}</Box>
                    </CardRow>
                </Card>

                <Card padding="2" pt="4" title="Info & contracts">
                    <CardRow>
                        <Box flex="1">BPT symbol</Box>
                        <Box>{pool.symbol}</Box>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Pool contract</Box>
                        <Link href={etherscanGetAddressUrl(pool.address)} target="_blank">
                            <HStack spacing="1">
                                <Box>{addressShortDisplayName(pool.address)}</Box>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Pool owner</Box>
                        <Link href={etherscanGetAddressUrl(pool.owner)} target="_blank">
                            <HStack spacing="1">
                                <Box>{addressShortDisplayName(pool.owner)}</Box>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </CardRow>
                    {pool.factory && (
                        <CardRow>
                            <Box flex="1">Factory contract</Box>
                            <Link href={etherscanGetAddressUrl(pool.factory)} target="_blank">
                                <HStack spacing="1">
                                    <Box>{addressShortDisplayName(pool.factory)}</Box>
                                    <ExternalLink size={16} />
                                </HStack>
                            </Link>
                        </CardRow>
                    )}
                </Card>
            </GridItem>
        </Grid>
    );
}
