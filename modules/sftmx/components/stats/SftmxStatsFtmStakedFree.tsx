import { Box, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useState } from 'react';
import {
    GqlSftmxStakingSnapshotDataRange,
    useSftmxGetStakingSnapshotsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { SftmxChartsFtmStakedFree } from '../charts/SftmxChartsFtmStakedFree';

export function SftmxStatsFtmStakedFree() {
    const [range, setRange] = useState<GqlSftmxStakingSnapshotDataRange>('THIRTY_DAYS');
    const { data: stakingSnapshotData } = useSftmxGetStakingSnapshotsQuery({
        variables: { range },
    });

    return (
        <Card shadow="lg" h="full" p="4" title="FTM staked">
            <Card h="full" w="full" p="4">
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
                <Box height="full">
                    {stakingSnapshotData && <SftmxChartsFtmStakedFree data={stakingSnapshotData.snapshots} />}
                </Box>
            </Card>
        </Card>
    );
}
