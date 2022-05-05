import { Grid, GridItem, VStack } from "@chakra-ui/react";
import Navbar from "../components/nav/Navbar";
import TradeCard from "../components/trade/TradeCard";

function Trade() {
  return (
    <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="7">
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" h="10" bg="beets.navy.300" />
      <GridItem w="100%" colSpan={4}>
        <TradeCard />
      </GridItem>
    </Grid>
  );
}
export default Trade;
