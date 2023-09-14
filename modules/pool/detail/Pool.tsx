import { Box, Button, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
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
import { NextLink } from '~/components/link/NextLink';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';

interface Props {
    isReliquaryPool: boolean;
}

export function Pool({ isReliquaryPool }: Props) {
    const { pool, isFbeetsPool } = usePool();
    const { investDisabled } = useNetworkConfig();
    const { total } = useLegacyFBeetsBalance();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                {isReliquaryPool ? (
                    <HStack width="full" justifyContent="flex-end">
                        <NextLink href="/mabeets" chakraProps={{ _hover: { textDecoration: 'none' } }}>
                            <BeetsTooltip label="Please go to the maBEETS page to invest or manage your liquidity for this pool.">
                                <Button variant="primary" width={{ base: '130px', lg: '160px' }}>
                                    Go to maBEETS
                                </Button>
                            </BeetsTooltip>
                        </NextLink>
                    </HStack>
                ) : (
                    <>
                        <PoolWarnings />
                        <HStack width="full" justifyContent="flex-end">
                            {!investDisabled[pool.id] && <PoolInvestModal />}
                            <PoolWithdrawModal activatorProps={{ disabled: isFbeetsPool && total > 0 }} />
                        </HStack>
                    </>
                )}

                <Grid gap="4" templateColumns={{ base: '1fr', lg: '300px 1fr' }} width="full">
                    <GridItem>
                        <PoolStats isReliquaryPool={isReliquaryPool} />
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
