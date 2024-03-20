import { Box, HStack, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useState } from 'react';
import {
    GqlSftmxStakingSnapshotDataRange,
    useSftmxGetStakingSnapshotsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { SftmxStatsChartsStakedFree } from './SftmxStatsChartsStakedFree';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import { SftmxStatsTable } from './SftmxStatsTable';

type StatsType = 'STAKED' | 'VAULTS';

export function SftmxStatsCharts() {
    const [statsType, setStatsType] = useState<StatsType>('STAKED');
    const [range, setRange] = useState<GqlSftmxStakingSnapshotDataRange>('THIRTY_DAYS');
    const { data: stakingSnapshotData } = useSftmxGetStakingSnapshotsQuery({
        variables: { range },
    });
    const { data: stakingData } = useSftmxGetStakingData();

    return (
        <Card h="full" w="full" p="4">
            <HStack padding={{ base: '2', lg: '4' }} pb="0" justify={{ base: 'space-between', lg: 'flex-start' }}>
                <Select
                    value={statsType}
                    onChange={(e) => setStatsType(e.currentTarget.value as StatsType)}
                    width="160px"
                    variant="filled"
                >
                    <option value="STAKED">FTM amounts</option>
                    <option value="VAULTS">Vaults</option>
                </Select>
                {statsType === 'STAKED' && (
                    <Select
                        pl={{ base: '1', lg: undefined }}
                        value={range}
                        onChange={(e) => setRange(e.currentTarget.value as GqlSftmxStakingSnapshotDataRange)}
                        width={{ base: '155px', lg: '160px' }}
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
            <Box height="full">
                {statsType === 'STAKED' && <SftmxStatsChartsStakedFree data={stakingSnapshotData?.snapshots || []} />}
                {statsType === 'VAULTS' && <SftmxStatsTable />}
            </Box>
        </Card>
    );
}
