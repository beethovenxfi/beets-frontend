import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { PoolActionsRow } from '~/modules/pool/detail/components/PoolActionsRow';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/PoolStakeInFarmWarning';

export function Pool() {
    const { hasBptInWallet } = usePoolUserBptBalance();
    const { pool } = usePool();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {hasBptInWallet && pool.staking && <PoolStakeInFarmWarning />}
                <Flex width="full" justifyContent="flex-end">
                    <PoolActionsRow />
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
