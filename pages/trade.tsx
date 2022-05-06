import { Grid, GridItem, VStack } from "@chakra-ui/react";
import TradeChart from "~/components/charts/TradeChart";
import Navbar from "../components/nav/Navbar";
import TradeCard from "../components/trade/TradeCard";

function Trade() {
  return (
    <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="0">
      <GridItem w="100%" colSpan={8} h="10">
        <TradeChart />
      </GridItem>

      <GridItem w="100%" colSpan={4}>
        <TradeCard />
      </GridItem>
    </Grid>
  );
}
export default Trade;
