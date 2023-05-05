import { Box, Grid, GridItem, HStack, VStack, Button } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import { PoolComposition } from '~/modules/pool/detail/components/composition/PoolComposition';
import PoolStats from '~/modules/pool/detail/components/stats/PoolStats';
import { PoolTransactions } from '~/modules/pool/detail/components/transactions/PoolTransactions';
import { PoolDetailCharts } from '~/modules/pool/detail/components/PoolDetailCharts';
import { NextLink } from '~/components/link/NextLink';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';

interface Props {
    isLegacyFbeetsPool: boolean;
}

export function ReliquaryPool({ isLegacyFbeetsPool }: Props) {
    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full" spacing="4">
                <HStack width="full" justifyContent="flex-end">
                    <NextLink href="/mabeets" chakraProps={{ _hover: { textDecoration: 'none' } }}>
                        <BeetsTooltip
                            label={
                                isLegacyFbeetsPool
                                    ? 'This pool is no longer receiving incentives. You can migrate your fBEETS from the maBEETS page to start receiving incentives again.'
                                    : 'Please go to the maBEETS page to invest or manage your liquidity for this pool.'
                            }
                        >
                            <Button variant="primary" width={{ base: '130px', lg: '160px' }}>
                                Go to maBEETS
                            </Button>
                        </BeetsTooltip>
                    </NextLink>
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
