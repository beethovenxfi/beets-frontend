import { Box, Flex, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';

import BeetsSmart from '~/assets/icons/beetx-smarts.svg';

import Image from 'next/image';
import { AnimatedBox } from '~/components/animation/chakra';
import TradeCard from '../modules/trade/components/TradeCard';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { AnimatePresence, useAnimation } from 'framer-motion';
import TradePreview from '~/modules/trade/components/TradePreview';
import { useEffect } from 'react';
import { BatchSwapList } from '~/components/batch-swap-list/BatchSwapList';
import { TradeChart } from '~/modules/trade/components/TradeChart';
import { useGetTradeSelectedTokenDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useGetTokens } from '~/lib/global/useToken';
import { TradeTokenDataCard } from '~/modules/trade/components/TradeTokenDataCard';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import numeral from 'numeral';

function Trade() {
    const { tradeContext, swaps, setPreviewVisible, tradeState } = useTrade();
    const beetsHeadControls = useAnimation();
    const tradePreviewControls = useAnimation();
    const { tokens, getToken, priceFor } = useGetTokens();
    const {
        tokenInData,
        tokenOutData,
        tokenInDynamicData,
        tokenOutDynamicData,
        loading,
        tokenOut,
        tokenIn,
        currentRatio,
    } = useTradeData();
    const { startingRatio, range } = useTradeChart();

    useEffect(() => {
        if (tradeContext.isPreviewVisible) {
            setTimeout(() => {
                beetsHeadControls.start({
                    opacity: 1,
                    scale: 1.75,
                    transition: { type: 'spring', stiffness: 250, damping: 15 },
                });
            }, 250);
            setTimeout(() => {
                beetsHeadControls.start({
                    opacity: 0,
                    scale: 0,
                });
            }, 500);
            setTimeout(() => {
                tradePreviewControls.start({
                    opacity: 1,
                    scale: 1,
                });
            }, 700);
        }
    }, [tradeContext.isPreviewVisible]);

    const handlePreviewClosed = () => {
        setPreviewVisible(false);
    };

    const percentChange = startingRatio ? (currentRatio - startingRatio) / startingRatio : null;

    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="12">
            <GridItem w="100%" colSpan={8} h="10">
                <Text textStyle="h1">
                    1
                    <Text as="span" fontSize="3xl" fontWeight="light">
                        {' '}
                        {tokenOut?.symbol}
                        {' / '}
                    </Text>
                    {tokenFormatAmount(currentRatio)}
                    <Text as="span" fontSize="3xl" fontWeight="light">
                        {' '}
                        {tokenIn?.symbol}
                    </Text>
                </Text>
                {percentChange !== null ? (
                    <Text>
                        <Text as="span" color={percentChange < 0 ? 'beets.red.300' : 'beets.green.500'}>
                            {numeral(percentChange).format('+0.[00]%')}
                        </Text>{' '}
                        in the past {range === 'SEVEN_DAY' ? 'week' : 'month'}
                    </Text>
                ) : null}

                {/*swaps ? <TradeRoutePreview swaps={swaps} /> : null*/}
                <Box mt="4">
                    <TradeChart />
                </Box>

                <Flex my="4">
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
                <Box mt="12">
                    <BatchSwapList />
                </Box>
            </GridItem>
            <GridItem w="100%" colSpan={4}>
                <VStack w="full" position="relative">
                    <AnimatePresence>
                        {!tradeContext.isPreviewVisible && (
                            <AnimatedBox
                                w="full"
                                animate={{ scale: 1, transition: { type: 'spring', stiffness: 250, damping: 15 } }}
                                transformOrigin="center"
                                initial={{
                                    position: 'relative',
                                    scale: 0.8,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.7,
                                    position: 'absolute',
                                    top: 0,
                                    width: 'fit-content',
                                    transition: { type: 'spring', stiffness: 250, damping: 15 },
                                }}
                            >
                                <TradeCard />
                            </AnimatedBox>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {tradeContext.isPreviewVisible && (
                            <>
                                <AnimatedBox
                                    // animate={{ opacity: 1, scale: 1, transition: { delay: 0.25 } }}
                                    animate={beetsHeadControls}
                                    initial={{ opacity: 0, scale: 0 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    position="absolute"
                                    top="100px"
                                >
                                    <VStack alignItems="center">
                                        <Image src={BeetsSmart} width="64px" alt="smart-beets" />
                                    </VStack>
                                </AnimatedBox>
                                <AnimatedBox
                                    w="full"
                                    animate={tradePreviewControls}
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.7,
                                        position: 'absolute',
                                        transition: { type: 'spring', stiffness: 250, damping: 15 },
                                    }}
                                >
                                    <TradePreview onClose={handlePreviewClosed} />
                                </AnimatedBox>
                            </>
                        )}
                    </AnimatePresence>
                </VStack>
            </GridItem>
        </Grid>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Trade;
