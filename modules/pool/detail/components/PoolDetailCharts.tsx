import { Box, BoxProps, Flex, HStack, Select, Text, VStack } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { PoolDetailBptPriceChart } from '~/modules/pool/detail/components/charts/PoolDetailBptPriceChart';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';

interface Props extends BoxProps {}

export function PoolDetailCharts({ ...rest }: Props) {
    const { pool } = usePool();
    const sharePrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);
    const totalShares24hAgo = parseFloat(pool.dynamicData.totalShares24hAgo);
    const sharePrice24hAgo =
        totalShares24hAgo > 0 ? parseFloat(pool.dynamicData.totalLiquidity24hAgo) / totalShares24hAgo : 0;
    const percentChange = (sharePrice - sharePrice24hAgo) / sharePrice24hAgo;

    return (
        <Card position="relative">
            <Flex padding="4" pb="0" alignItems="center">
                <Box flex="1">
                    <Text color="beets.base.50" fontSize="sm" fontWeight="semibold">
                        Share price
                    </Text>
                    <Flex alignItems="flex-end">
                        <Text as="h2" fontSize="3xl" color="white" fontWeight="bold">
                            {numberFormatUSDValue(sharePrice)}
                        </Text>
                        <PercentChangeBadge percentChange={percentChange} mb="2.5" ml="2" />
                    </Flex>
                </Box>
                <HStack spacing="4">
                    <Select width="200px" value="share-price" variant="filled">
                        <option value="share-price">Share price</option>
                        <option value="option2">Volume / TVL</option>
                        <option value="option3">Fees</option>
                    </Select>
                    <Select width="116px" value="share-price" variant="filled">
                        <option value="share-price">7 days</option>
                        <option value="option2">30 days</option>
                        <option value="option2">All time</option>
                    </Select>
                </HStack>
            </Flex>

            <VStack width="full" height="full">
                <PoolDetailBptPriceChart />
            </VStack>
        </Card>
    );
}
