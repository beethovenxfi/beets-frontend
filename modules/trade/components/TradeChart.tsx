import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import { Box, Flex, HStack, Link, Skeleton } from '@chakra-ui/react';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { BeetsBox } from '~/components/box/BeetsBox';

export function TradeChart() {
    const { setRange, range, data, loading, networkStatus } = useTradeChart();
    const { tokenOut, tokenIn } = useTradeData();

    const sevenDaySelected = range === 'SEVEN_DAY';
    const thirtyDaySelected = range === 'THIRTY_DAY';

    return (
        <Box>
            {!loading && data && data.prices.length === 0 ? (
                <BeetsBox
                    height="150px"
                    borderColor="gray.200"
                    borderWidth={1}
                    borderStyle="dashed"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    We were unable to find pricing data for the selected pair
                </BeetsBox>
            ) : (loading && !data) || !tokenIn || !tokenOut ? (
                <Skeleton height="150px" />
            ) : (
                <Box height="150px">
                    <TokenPriceLineChart
                        prices={data?.prices || []}
                        label={``}
                        priceValueFormatter={(value) =>
                            `1 ${tokenIn?.symbol} = ${tokenFormatAmount(value)} ${tokenOut?.symbol}`
                        }
                    />
                </Box>
            )}
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
