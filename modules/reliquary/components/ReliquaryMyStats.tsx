import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import RelicMaturity from './RelicMaturity';
import RelicApr from './RelicApr';
import RelicLiquidity from './RelicLiquidity';
import RelicRewards from './RelicRewards';

export default function ReliquaryMyStats() {
    return (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6">
            <GridItem w="full">
                <RelicApr />
            </GridItem>
            <GridItem w="100%">
                <RelicLiquidity />
            </GridItem>
            <GridItem w="100%">
                <RelicRewards />
            </GridItem>
            <GridItem w="100%">
                <RelicMaturity />
            </GridItem>
        </Grid>
    );
}
