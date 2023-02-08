import { Box, Grid, GridItem, HStack, VStack, Text, Button } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';
import { PoolProvider, usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolFbeetsWarning } from '~/modules/pool/detail/components/PoolFbeetsWarning';
import { useEffect } from 'react';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';
import ReliquaryMigrateModal from '~/modules/reliquary/components/ReliquaryMigrateModal';
import { TokensProvider } from '~/lib/global/useToken';

export function ReliquaryPool() {
    const { pool, isFbeetsPool } = usePool();
    const { hasBpt } = usePoolUserBptBalance();
    const { total } = useLegacyFBeetsBalance();
    const { showToast, removeToast } = useToast();

    useEffect(() => {
        return () => {
            removeToast('migrate-fbeets');
        };
    }, []);

    useEffect(() => {
        if (total > 0 && isFbeetsPool) {
            showToast({
                id: 'migrate-fbeets',
                type: ToastType.Warn,
                content: (
                    <HStack>
                        <Text>You can migrate your legacy fBEETS position to a relic</Text>
                        <TokensProvider>
                            <PoolProvider pool={pool}>
                                <ReliquaryMigrateModal />
                            </PoolProvider>
                        </TokensProvider>
                    </HStack>
                ),
            });
        } else {
            removeToast('migrate-fbeets');
        }
    }, [total]);

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {isFbeetsPool && hasBpt && total === 0 && <PoolFbeetsWarning />}
                <HStack width="full" justifyContent="flex-end">
                    <Button>Go to maBEETS</Button>
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
