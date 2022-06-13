import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import { NetworkStatus } from '@apollo/client';
import { Box, Flex, HStack, Link, Skeleton } from '@chakra-ui/react';
import { useTradeData } from '~/modules/trade/lib/useTradeData';

export function TradeChart() {
    const { setRange, range, data, loading, networkStatus } = useTradeChart();
    const { tokenOut, tokenIn } = useTradeData();

    if (loading && !data) {
        //loading and no data
        return <Skeleton height="3xs" />;
    }

    if (loading || networkStatus === NetworkStatus.refetch) {
        //loading or reloading and data exists
    }

    if (!data || data.prices.length === 0) {
        // no data
    }

    if (!tokenIn || !tokenOut) {
        //tokens not yet populated
        return <Skeleton height="3xs" />;
    }

    const sevenDaySelected = range === 'SEVEN_DAY';
    const thirtyDaySelected = range === 'THIRTY_DAY';

    return (
        <Box>
            <Box height="3xs">
                <TokenPriceLineChart prices={data?.prices || []} tokenIn={tokenIn} tokenOut={tokenOut} />
            </Box>
            {/*<Skeleton height="3xs" />*/}
            <Flex mt="2">
                <Box flex={1} />
                <HStack>
                    <Link
                        mr="2"
                        userSelect="none"
                        color={!sevenDaySelected ? 'gray.200' : undefined}
                        textDecoration={sevenDaySelected ? 'underline' : undefined}
                        fontWeight="bold"
                        onClick={() => {
                            if (!sevenDaySelected) {
                                setRange('SEVEN_DAY');
                            }
                        }}
                    >
                        1W
                    </Link>
                    <Link
                        userSelect="none"
                        color={!thirtyDaySelected ? 'gray.200' : undefined}
                        textDecoration={thirtyDaySelected ? 'underline' : undefined}
                        fontWeight="bold"
                        onClick={() => {
                            if (!thirtyDaySelected) {
                                setRange('THIRTY_DAY');
                            }
                        }}
                    >
                        1M
                    </Link>
                </HStack>
            </Flex>
        </Box>
    );
}
