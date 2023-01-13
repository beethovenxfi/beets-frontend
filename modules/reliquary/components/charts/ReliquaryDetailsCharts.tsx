import { HStack, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { PoolDetailBptPriceChart } from '~/modules/pool/detail/components/charts/PoolDetailBptPriceChart';
import { useState } from 'react';
import { PoolDetailVolumeLiquidityChart } from '~/modules/pool/detail/components/charts/PoolDetailVolumeLiquidityChart';
import { PoolDetailFeesChart } from '~/modules/pool/detail/components/charts/PoolDetailFeesChart';
import {
    GqlPoolSnapshotDataRange,
    useGetReliquaryFarmSnapshotsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { ReliquaryMaturityChart } from './ReliquaryMaturityChart';

type ChartType = 'REL_MAT' | 'RELICS' | 'TVL';

export function ReliquaryDetailsCharts() {
    const { pool } = usePool();
    const [chartType, setChartType] = useState<ChartType>('REL_MAT');
    const [range, setRange] = useState<GqlPoolSnapshotDataRange>('THIRTY_DAYS');
    const { data } = useGetReliquaryFarmSnapshotsQuery({
        variables: { id: networkConfig.reliquary.fbeets.farmId.toString(), range },
    });

    console.log(data);

    return (
        <Card height="full" minHeight="300px">
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
            {/*{chartType === 'TVL' && <PoolDetailVolumeLiquidityChart data={data?.snapshots || []} />}
            {chartType === 'RELICS' && <PoolDetailFeesChart data={data?.snapshots || []} />} */}
        </Card>
    );
}
