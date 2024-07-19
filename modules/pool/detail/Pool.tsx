import { Box, Button, Grid, GridItem, HStack, Link, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { PoolWarnings } from '~/modules/pool/detail/components/warning/PoolWarnings';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';

export function Pool() {
    const { pool, isFbeetsPool } = usePool();
    const { investDisabled, rehypePools } = useNetworkConfig();
    const { total } = useLegacyFBeetsBalance();
    const rehypePool = rehypePools.find((rehypePool) => pool.id === rehypePool.poolId);

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                <PoolWarnings />
                <HStack width="full" justifyContent="flex-end">
                    {rehypePool ? (
                        <Link href={rehypePool.url} isExternal>
                            <Button variant="primary" width={{ base: 'full', md: '300px' }}>
                                {rehypePool.buttonText}
                            </Button>
                        </Link>
                    ) : (
                        <>
                            {!investDisabled[pool.id] && <PoolInvestModal />}
                            <PoolWithdrawModal activatorProps={{ disabled: isFbeetsPool && total > 0 }} />
                        </>
                    )}
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
