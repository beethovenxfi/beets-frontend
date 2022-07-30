import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { TradeInterfaceContainer } from '~/modules/trade/components/TradeInterfaceContainer';
import { TradePageHeader } from '~/modules/trade/components/TradePageHeader';
import { TradeChart } from '~/modules/trade/components/TradeChart';
import { useGetTokens } from '~/lib/global/useToken';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { BatchSwapList } from '~/components/batch-swap/BatchSwapList';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

export function TradeContainer() {
    const { priceFor } = useGetTokens();
    const { tokenInData, tokenOutData, tokenInDynamicData, tokenOutDynamicData, tokenOut, tokenIn } = useTradeData();
    const { swapInfo, loadingSwaps } = useTrade();
    const showRouting = loadingSwaps || (swapInfo && swapInfo.swaps.length > 0);
    const hasNoRoute = !loadingSwaps && (!swapInfo || swapInfo.swaps.length === 0);

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

                {/*
                // @ts-ignore */}
                <AnimateSharedLayout>
                    <AnimatePresence>
                        {swapInfo && swapInfo.swaps.length > 0 && (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Text fontSize="xl" fontWeight="bold" lineHeight="1.2rem" mt="8">
                                    Smart order routing
                                </Text>
                                <Text mb="4" color="gray.200">
                                    The SOR searches all Beethoven X pools to ensure you receive the best available
                                    price.
                                </Text>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {swapInfo && swapInfo.swaps.length > 0 && <BatchSwapSorRoute swapInfo={swapInfo} />}

                    <motion.div layout>
                        <Text fontSize="xl" fontWeight="bold" lineHeight="1.2rem" mt="8">
                            Latest swaps
                        </Text>
                        <Text mb="4" color="gray.200">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie gravida.
                        </Text>
                    </motion.div>
                    {tokenIn && tokenOut && <BatchSwapList tokenIn={tokenIn.address} tokenOut={tokenOut.address} />}
                </AnimateSharedLayout>

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
            </GridItem>
        </Grid>
    );
}
