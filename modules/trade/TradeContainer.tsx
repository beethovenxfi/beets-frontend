import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { TradeInterfaceContainer } from '~/modules/trade/components/TradeInterfaceContainer';
import { TradePageHeader } from '~/modules/trade/components/TradePageHeader';
import { TradeChart } from '~/modules/trade/components/TradeChart';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { BatchSwapList } from '~/components/batch-swap/BatchSwapList';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

export function TradeContainer() {
    const { tokenOut, tokenIn } = useTradeData();
    const { swapInfo, isNativeAssetUnwrap, isNativeAssetWrap } = useTrade();
    const showRouting = !isNativeAssetUnwrap && !isNativeAssetWrap && swapInfo && swapInfo.swaps.length > 0;

    return (
        <Box>
            <Grid
                templateAreas={{
                    base: `"swap"
                       "chart-route"`,
                    xl: `"swap chart-route"`,
                }}
                templateColumns={{ base: '1fr', xl: '412px 1fr' }}
                gap="10"
                pb="20"
            >
                <GridItem area="swap">
                    <TradeInterfaceContainer />
                </GridItem>
                <GridItem area="chart-route">
                    <TradePageHeader />

                    <Box mt="2">
                        <TradeChart />
                    </Box>

                    <Box display={{ base: 'none', md: 'block' }}>
                        {/*
                    // @ts-ignore */}
                        <AnimateSharedLayout>
                            <AnimatePresence>
                                {showRouting && (
                                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Text fontSize="xl" fontWeight="bold" lineHeight="1.2rem" mt="8">
                                            Smart order routing
                                        </Text>
                                        <Text mb="4" color="gray.200">
                                            The SOR searches all Beethoven X pools to ensure you receive the best
                                            available price.
                                        </Text>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {showRouting && <BatchSwapSorRoute swapInfo={swapInfo} />}

                            <motion.div layout>
                                <Text fontSize="xl" fontWeight="bold" lineHeight="1.2rem" mt="8">
                                    Latest swaps
                                </Text>
                                <Text mb="4" color="subheading">
                                    The latest swaps for your selected token pair.
                                </Text>
                            </motion.div>
                            {tokenIn && tokenOut && (
                                <BatchSwapList tokenIn={tokenIn.address} tokenOut={tokenOut.address} />
                            )}
                        </AnimateSharedLayout>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
