import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { PoolActionsRow } from '~/modules/pool/detail/components/PoolActionsRow';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/PoolStakeInFarmWarning';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';

export function Pool() {
    const { pool } = usePool();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {pool.staking && <PoolStakeInFarmWarning />}
                <Flex width="full" justifyContent="flex-end">
                    <PoolActionsRow />
                </Flex>
                <HStack width="full" spacing="3" height="540px">
                    <PoolStats />
                    <PoolDetailCharts />
                </HStack>
            </VStack>
            <VStack spacing="8" width="full">
                <PoolComposition />
                <PoolTransactions />
            </VStack>
        </Box>
    );
}
