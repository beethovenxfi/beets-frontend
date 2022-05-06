import { Box, Text, Container, Heading } from '@chakra-ui/react';
import { useGetTokenPricesQuery } from '../../apollo/generated/graphql-codegen-generated';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();

    return (
        <Box
            bg="#0F0F22"
            border="2px"
            borderColor="beets.green.800"
            width="full"
            height="96"
            shadow="2xl"
            rounded="xl"
            padding="4"
        >
            <Heading>Trade Card</Heading>
            {data?.tokenPriceGetCurrentPrices.slice(0, 10).map((item, index) => (
                <Container key={index} color={'white'}>
                    {item.address} - {item.price}
                </Container>
            ))}
        </Box>
    );
}

export default TradeCard;
