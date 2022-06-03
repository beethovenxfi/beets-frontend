import { Grid, GridItem, VStack, Box } from '@chakra-ui/react';
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
import { BatchSwapList } from '~/components/batch-swap-list/BatchSwapList';

function Trade() {
    const { data, loading, error } = useGetTokensQuery();

    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="0">
            <GridItem w="100%" colSpan={8} h="10">
                <TradeChart />
                <BatchSwapList />
            </GridItem>
            <GridItem w="100%" colSpan={4}>
                <VStack>
                    <TradeCard />
                    {/* <AnimatedBox
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        initial={{ transform: 'scale(0)' }}
                        exit={{ transform: 'scale(0)' }}
                        animate={{ transform: 'scale(100%)' }}
                    >
                        <VStack spacing="4" padding="4">
                            <AnimatedChevrons delay={.1}  />
                            <Box>
                                <Image src={BeetsSmart} width="64px" alt="smart-beets" />
                            </Box>
                            <AnimatedChevrons color="beets.red.300" delay={.8} />
                        </VStack>
                    </AnimatedBox> */}
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
