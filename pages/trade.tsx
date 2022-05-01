import { Grid, GridItem, VStack } from "@chakra-ui/react";
import Navbar from "../components/nav/Navbar";
import TradeCard from "../components/trade/TradeCard";

function Trade() {
  return (
    <VStack spacing="16" marginX="32">
      <Navbar />
      <Grid width="full" templateColumns="repeat(12, 1fr)" gap="7">
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" h="10" bg="gray.900" />
        <GridItem w="100%" colSpan={4}>
          <TradeCard />
        </GridItem>
      </Grid>
    </VStack>
  );
}
export default Trade;
