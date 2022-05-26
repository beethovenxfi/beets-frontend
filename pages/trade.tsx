import { Grid, GridItem, VStack, Box, Text } from '@chakra-ui/react';
import TradeChart from '~/components/charts/TradeChart';
import Navbar from '../components/nav/Navbar';

import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import Chevron3 from '~/assets/icons/chevron_down3.svg';

import Image from 'next/image';
import { AnimatedBox } from '~/components/animation/chakra';
import AnimatedChevrons from '~/components/animation/chevron/AnimatedChevrons';
import Card from '~/components/card/Card';
import { GetPoolsQuery, GetPoolsQueryVariables, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';
import TradeCard from '../modules/trade/TradeCard';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPools } from '~/apollo/generated/operations';
import { DEFAULT_POOL_LIST_QUERY_VARS } from '~/modules/pools/usePoolList';
import { tradeContextVar, useTrade } from '~/modules/trade/tradeState';
import { AnimatePresence, useAnimation } from 'framer-motion';
import TradePreview from '~/modules/trade/TradePreview';
import { useEffect } from 'react';

function Trade() {
    const { tradeContext } = useTrade();
    const beetsHeadControls = useAnimation();
    const tradePreviewControls = useAnimation();

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
        tradeContextVar({
            ...tradeContext,
            isPreviewVisible: false,
        });
    };

    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="0">
            <GridItem w="100%" colSpan={8} h="10">
                <TradeChart />
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
                                    exit={{ opacity: 0, scale: 0.7, position: 'absolute', transition: { type: 'spring', stiffness: 250, damping: 15 } }}
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
