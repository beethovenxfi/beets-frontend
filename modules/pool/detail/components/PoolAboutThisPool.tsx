import { usePool } from '~/modules/pool/lib/usePool';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import Card from '~/components/card/Card';

export function PoolAboutThisPool() {
    const { pool } = usePool();

    return (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4" width="full">
            <GridItem colSpan={2}>
                <Card padding="4" width="full">
                    Abc
                </Card>
            </GridItem>
            <GridItem>
                <Card padding="4" width="full">
                    Abc
                </Card>
            </GridItem>
        </Grid>
    );
}
