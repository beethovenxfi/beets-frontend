import { Box, Flex, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/PoolStakeInFarmWarning';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';

export function Pool() {
    const { pool } = usePool();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {pool.staking && <PoolStakeInFarmWarning />}
                <Flex width="full" justifyContent="flex-end">
                    <PoolInvestModal />
                    <PoolWithdrawModal />
                </Flex>
                <Grid gap="4" templateColumns={{ base: '1fr', lg: '300px 1fr' }} width="full">
                    <GridItem>
                        <PoolStats />
                    </GridItem>
                    <GridItem>
                        <PoolDetailCharts />
                    </GridItem>
                </Grid>
            </VStack>
            <VStack spacing="8" width="full">
                <PoolComposition />
                <PoolTransactions />
            </VStack>
        </Box>
    );
}
