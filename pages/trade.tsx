import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { BatchSwapList } from '~/components/batch-swap-list/BatchSwapList';
import { TradeChart } from '~/modules/trade/components/TradeChart';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useGetTokens } from '~/lib/global/useToken';
import { TradeTokenDataCard } from '~/modules/trade/components/TradeTokenDataCard';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import numeral from 'numeral';
import { TradeInterfaceContainer } from '~/modules/trade/components/TradeInterfaceContainer';
import { TradePageHeader } from '~/modules/trade/components/TradePageHeader';

function Trade() {
    const { priceFor } = useGetTokens();
    const { tokenInData, tokenOutData, tokenInDynamicData, tokenOutDynamicData, tokenOut, tokenIn } = useTradeData();

    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="12">
            <GridItem w="100%" colSpan={8} h="10">
                <TradePageHeader />

                {/*swaps ? <TradeRoutePreview swaps={swaps} /> : null*/}
                <Box mt="8">
                    <TradeChart />
                </Box>

                <Flex mt="12" mb="8">
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
                <TradeInterfaceContainer />
            </GridItem>
        </Grid>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Trade;
