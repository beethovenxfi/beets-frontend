import { HStack, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useState } from 'react';
import {
    GqlPoolSnapshotDataRange,
    useGetReliquaryFarmSnapshotsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import { ReliquaryMaturityChart } from './ReliquaryMaturityChart';
import { ReliquaryLiquidityChart } from './ReliquaryLiquidityChart';
import { ReliquaryRelicsCountChart } from './ReliquaryRelicsCountChart';

type ChartType = 'REL_MAT' | 'RELICS' | 'TVL';

export function ReliquaryDetailsCharts() {
    const [chartType, setChartType] = useState<ChartType>('REL_MAT');
    const [range, setRange] = useState<GqlPoolSnapshotDataRange>('THIRTY_DAYS');
    const { data } = useGetReliquaryFarmSnapshotsQuery({
        variables: { id: networkConfig.reliquary.fbeets.farmId.toString(), range },
    });

    return (
        <Card height="full" minHeight="300px" px="4" py="8">
            <HStack padding={{ base: '2', lg: '4' }} pb="0" justify={{ base: 'space-between', lg: 'flex-start' }}>
                <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.currentTarget.value as ChartType)}
                    width="180px"
                    variant="filled"
                >
                    <option value="REL_MAT">Relic maturity</option>
                    <option value="RELICS">Relics</option>
                    <option value="TVL">TVL</option>
                </Select>
                {chartType !== 'REL_MAT' && (
                    <Select
                        value={range}
                        onChange={(e) => setRange(e.currentTarget.value as GqlPoolSnapshotDataRange)}
                        width="160px"
                        variant="filled"
                    >
                        <option value="THIRTY_DAYS">last 30 days</option>
                        <option value="NINETY_DAYS">last 90 days</option>
                        <option value="ONE_HUNDRED_EIGHTY_DAYS">last 180 days</option>
                        <option value="ONE_YEAR">last 365 days</option>
                        <option value="ALL_TIME">All time</option>
                    </Select>
                )}
            </HStack>
            {chartType === 'REL_MAT' && <ReliquaryMaturityChart />}
            {chartType === 'TVL' && <ReliquaryLiquidityChart data={data?.snapshots || []} />}
            {chartType === 'RELICS' && <ReliquaryRelicsCountChart data={data?.snapshots || []} />}
        </Card>
    );
}
