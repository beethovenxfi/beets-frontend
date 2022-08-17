import { Box, Wrap, Text, WrapItem, Grid, GridItem, VStack } from '@chakra-ui/react';
import { usePool } from '../lib/usePool';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';

export function PoolOpenGraph() {
    const { pool } = usePool();

    return (
        <Box fontSize="xl">
            <Grid templateColumns={'1fr'} width="1200px" height="630px" id="og" p="50px">
                <GridItem>
                    <VStack width="full" alignItems="flex-start" mb="8">
                        <Text fontWeight="bold" fontSize="5rem" mr="4">
                            {pool.name}
                        </Text>
                        <Wrap>
                            {pool.tokens.map((token, index) => (
                                <WrapItem key={index}>
                                    <PoolTokenPill token={token} size="xl" />
                                </WrapItem>
                            ))}
                        </Wrap>
                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
}
