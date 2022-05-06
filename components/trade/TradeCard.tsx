import { Box, Heading, VStack } from "@chakra-ui/react";
import TokenInput from "../inputs/TokenInput";

function TradeCard() {
  return (
    <Box
      bg="#19193B"
      border="2px"
      borderColor="beets.green.800"
      width="full"
      height="xl"
      // shadow="2xl"
      rounded="xl"
      padding="4"
    >
      <VStack spacing="4">
        <Heading color="gray.300" size="md">
          I want to trade
        </Heading>
        <TokenInput />
      </VStack>
    </Box>
  );
}

export default TradeCard;
