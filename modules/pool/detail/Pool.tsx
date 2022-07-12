import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import PoolActionRow from '~/modules/pool/detail/components/PoolActionRow';

export function Pool() {
    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                <Flex width="full" justifyContent="flex-end">
                    <PoolActionRow />
                </Flex>
                <HStack width="full" spacing="3" height="475px">
                    <PoolStats />
                    <PoolDetailChart />
                </HStack>
            </VStack>
            <VStack spacing="8" width="full">
                <PoolComposition />
                <PoolTransactions />
            </VStack>
        </Box>
    );
}
