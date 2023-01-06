import { Box, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/PoolStakeInFarmWarning';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolFbeetsWarning } from '~/modules/pool/detail/components/PoolFbeetsWarning';
import { PoolOvernightWarning } from '~/modules/pool/detail/components/PoolOvernightWarning';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { PoolDetailWarning } from '~/modules/pool/detail/components/PoolDetailWarning';

export function Pool() {
    const { pool, isFbeetsPool } = usePool();
    const { hasBpt } = usePoolUserBptBalance();
    const { warnings, investDisabled } = useNetworkConfig();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {pool.id === '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e' && (
                    <PoolOvernightWarning />
                )}
                {warnings.poolDetail[pool.id] && <PoolDetailWarning warning={warnings.poolDetail[pool.id]} />}
                {pool.staking && !isFbeetsPool && <PoolStakeInFarmWarning />}
                {isFbeetsPool && hasBpt && <PoolFbeetsWarning />}
                <HStack width="full" justifyContent="flex-end">
                    {!investDisabled[pool.id] && <PoolInvestModal />}
                    <PoolWithdrawModal />
                </HStack>
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
