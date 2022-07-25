import { Box, BoxProps, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';
import { GqlTokenChartDataRange, useGetPoolBptPriceChartDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { usePool } from '~/modules/pool/lib/usePool';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { Badge } from '@chakra-ui/layout';

interface Props extends BoxProps {}

export function PoolDetailBptPriceChart({ ...rest }: Props) {
    const { pool } = usePool();
    const [range, setRange] = useState<GqlTokenChartDataRange>('SEVEN_DAY');
    const { data } = useGetPoolBptPriceChartDataQuery({ variables: { address: pool.address, range } });

    return (
        <VStack width="full" height="full">
            <Box width="full" padding="4" pb="0">
                <Text color="beets.base.50" fontSize="sm" fontWeight="semibold">
                    Share price
                </Text>
                <HStack>
                    <Text as="h2" fontSize="3xl" color="white" fontWeight="bold">
                        {numberFormatUSDValue(
                            parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares),
                        )}
                    </Text>
                    <Badge colorScheme="green" size="lg">
                        5.20%
                    </Badge>
                </HStack>
            </Box>
            <Box width="full" height="full" px="0" py="0">
                <TokenPriceLineChart label="Share price" prices={data?.prices || []} />
            </Box>
        </VStack>
    );
}
