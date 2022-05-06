import { Box, Text, Container, Heading, VStack } from '@chakra-ui/react';
import { useGetTokenPricesQuery } from '../../apollo/generated/graphql-codegen-generated';
import TokenInput from '../inputs/TokenInput';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();

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
                {data?.tokenPriceGetCurrentPrices.slice(0, 10).map((item, index) => (
                    <Container key={index} color={'white'}>
                        {item.address} - {item.price}
                    </Container>
                ))}
            </VStack>
        </Box>
    );
}
export default TradeCard;
