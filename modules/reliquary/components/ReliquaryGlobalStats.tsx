import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { ReliquaryCurveChart } from './ReliquaryCurveChart';
import { ReliquaryDetailCharts } from './ReliquaryDetailCharts';
import ReliquaryOverallStats from './ReliquaryOverallStats';

export default function ReliquaryGlobalStats() {
    return (
        <Grid
            templateColumns={{ base: '1fr', lg: '400px 1fr' }}
            templateRows={{ base: undefined, lg: 'repeat(5, 1fr)' }}
            gap="6"
            h="full"
            w="full"
        >
            <GridItem
                w="full"
                rowStart={{ base: undefined, lg: 1 }}
                rowEnd={{ base: undefined, lg: 6 }}
                colStart={{ base: undefined, lg: 1 }}
                colEnd={{ base: undefined, lg: 2 }}
            >
                <ReliquaryOverallStats />
            </GridItem>
            <GridItem
                w="full"
                rowStart={{ base: undefined, lg: 1 }}
                rowEnd={{ base: undefined, lg: 4 }}
                colStart={{ base: undefined, lg: 2 }}
                colEnd={{ base: undefined, lg: 3 }}
            >
                <ReliquaryDetailCharts />
            </GridItem>
            <GridItem
                w="full"
                rowStart={{ base: undefined, lg: 4 }}
                rowEnd={{ base: undefined, lg: 6 }}
                colStart={{ base: undefined, lg: 2 }}
                colEnd={{ base: undefined, lg: 3 }}
            >
                <ReliquaryCurveChart />
            </GridItem>
        </Grid>
    );
}
