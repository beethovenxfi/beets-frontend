import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import { NetworkStatus } from '@apollo/client';
import { Box, Flex, HStack, Link, Skeleton } from '@chakra-ui/react';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { BeetsBox } from '~/components/box/BeetsBox';

export function TradeChartSparkline() {
    const { setRange, range, data, loading, networkStatus } = useTradeChart();
    const { tokenOut, tokenIn } = useTradeData();

    if (loading && !data) {
        //loading and no data
        return <Skeleton height="125px" />;
    }

    if (loading || networkStatus === NetworkStatus.refetch) {
        //loading or reloading and data exists
    }

    if (!data || data.prices.length === 0) {
        // no data
    }

    if (!tokenIn || !tokenOut) {
        //tokens not yet populated
        return <Skeleton height="125px" />;
    }

    const sevenDaySelected = range === 'SEVEN_DAY';
    const thirtyDaySelected = range === 'THIRTY_DAY';

    return (
        <Box backgroundColor="blackAlpha.500" rounded="lg" width="full">
            <Box height="125px">
                <TokenPriceLineChart
                    prices={data?.prices || []}
                    priceValueFormatter={(value) => `${value}`}
                    label={`${tokenOut?.symbol}/${tokenIn?.symbol}`}
                />
            </Box>
        </Box>
    );
}
