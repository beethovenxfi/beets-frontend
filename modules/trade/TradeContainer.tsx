import { Box, Grid, GridItem } from '@chakra-ui/react';
import { TradeInterfaceContainer } from '~/modules/trade/components/TradeInterfaceContainer';
import { TradePageHeader } from '~/modules/trade/components/TradePageHeader';
import { TradeChart } from '~/modules/trade/components/TradeChart';
import { useGetTokens } from '~/lib/global/useToken';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { BatchSwapRoute } from '~/components/batch-swap-route/BatchSwapRoute';

export function TradeContainer() {
    const { priceFor } = useGetTokens();
    const { tokenInData, tokenOutData, tokenInDynamicData, tokenOutDynamicData, tokenOut, tokenIn } = useTradeData();
    const { swaps } = useTrade();

    return (
        <Grid
            templateAreas={{
                base: `"swap"
                       "chart-route"`,
                xl: `"swap chart-route"`,
            }}
            templateColumns={{ base: '1fr', xl: '400px 1fr' }}
            gap="12"
            pb="20"
            pt="8"
        >
            <GridItem area="swap">
                <TradeInterfaceContainer />
            </GridItem>
            <GridItem area="chart-route">
                <TradePageHeader />

                <Box mt="2">
                    <TradeChart />
                </Box>

                {swaps ? <BatchSwapRoute swaps={swaps} /> : null}
                {/*<Flex mt="12" mb="8">
                        {tokenIn ? (
                            <TradeTokenDataCard
                                token={tokenIn}
                                price={priceFor(tokenIn.address)}
                                data={tokenInData}
                                dynamicData={tokenInDynamicData}
                                flex={1}
                                mr="4"
                            />
                        ) : null}
                        {tokenOut ? (
                            <TradeTokenDataCard
                                token={tokenOut}
                                price={priceFor(tokenOut.address)}
                                data={tokenOutData}
                                dynamicData={tokenOutDynamicData}
                                flex={1}
                            />
                        ) : null}
                    </Flex>
                    <Box height="2xs" />*/}
                {/*<Box mt="12">
                    <BatchSwapList />
                </Box>*/}
            </GridItem>
        </Grid>
    );
}
