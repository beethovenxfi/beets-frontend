import { Box, VStack } from '@chakra-ui/react';
import PoolHeaderOpenGraph from '~/modules/pool/og/PoolHeaderOpenGraph';
import { PoolTransactions } from '~/modules/pool/detail/components/transactions/PoolTransactions';

export function PoolOpenGraph() {
    return (
        <Box marginBottom="8">
            <PoolHeaderOpenGraph />
            <VStack spacing="8" width="full">
                <PoolTransactions />
            </VStack>
        </Box>
    );
}
