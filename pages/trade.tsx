import { Grid, GridItem, VStack, Box } from '@chakra-ui/react';
import TradeChart from '~/components/charts/TradeChart';
import Navbar from '../components/nav/Navbar';
import TradeCard from '../components/trade/TradeCard';

import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import Chevron3 from '~/assets/icons/chevron_down3.svg';

import Image from 'next/image';
import { ChakraBox } from '~/components/animation/chakra';
import AnimatedChevrons from '~/components/animation/chevron/AnimatedChevrons';
import Card from '~/components/card/Card';
function Trade() {
    const { data, loading, error } = useGetTokensQuery();

    console.log('bing', data?.tokens, loading);

    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="0">
            <GridItem w="100%" colSpan={8} h="10">
                <TradeChart />
            </GridItem>
            <GridItem w="100%" colSpan={4}>
                <VStack>
                    <TradeCard />
                    {/* <ChakraBox
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
                    </ChakraBox> */}
               
                </VStack>
            </GridItem>
        </Grid>
    );
}
export default Trade;
