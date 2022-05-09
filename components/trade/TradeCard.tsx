import { Box, Text, Container } from '@chakra-ui/react';
import { useGetTokenPricesQuery } from '../../apollo/generated/graphql-codegen-generated';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();

    return (
        <Box bg="gray.900" width="full" shadow="lg" rounded="lg" padding="4">
            Trade Card
            {data?.tokenGetCurrentPrices.slice(0, 10).map((item, index) => (
                <Container key={index} color={'white'}>
                    {item.address} - {item.price}
                </Container>
            ))}
        </Box>
    );
}

export default TradeCard;
