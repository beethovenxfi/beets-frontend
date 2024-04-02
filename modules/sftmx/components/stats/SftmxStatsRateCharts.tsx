import { Box, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useState } from 'react';
import {
    GqlTokenChartDataRange,
    useGetHistoricalTokenPricesQuery,
    useSftmxGetStakingSnapshotsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { SftmxStatsFtmStakedFree } from './SftmxStatsFtmStakedFree';
import { networkConfig } from '~/lib/config/network-config';

export function SftmxStatsRateCharts() {
    const [range, setRange] = useState<GqlTokenChartDataRange>('THIRTY_DAY');
    const { data: stakingSnapshotData } = useSftmxGetStakingSnapshotsQuery({
        variables: { range: 'THIRTY_DAYS' },
    });
    const { data: historicalTokenPricesData } = useGetHistoricalTokenPricesQuery({
        variables: {
            addresses: [networkConfig.wethAddress, networkConfig.sftmx.address],
            chain: networkConfig.chainName,
            range,
        },
    });

    const ftmPrices = historicalTokenPricesData?.tokenGetHistoricalPrices.find(
        (price) => price.address === networkConfig.wethAddress,
    )?.prices;
    const sftmxPrices = historicalTokenPricesData?.tokenGetHistoricalPrices.find(
        (price) => price.address === networkConfig.sftmx.address,
    )?.prices;

    const data = stakingSnapshotData?.snapshots.map((item) => {
        const ftmPrice = ftmPrices?.find((price) => price.timestamp === item.timestamp.toString());
        const sftmxPrice = sftmxPrices?.find((price) => price.timestamp === item.timestamp.toString());

        if (!ftmPrice || !sftmxPrice) {
            return;
        }

        const calculatedSftmxPrice = ftmPrice.price * parseFloat(item.exchangeRate);
        const diff = calculatedSftmxPrice - sftmxPrice.price;

        return {
            timestamp: item.timestamp,
            ftmPrice,
            sftmxPrice,
            calculatedSftmxPrice,
            diff,
        };
    });

    return (
        <Card h="full" w="full" p="4">
            <Select
                pl={{ base: '1', lg: undefined }}
                value={range}
                onChange={(e) => setRange(e.currentTarget.value as GqlTokenChartDataRange)}
                width={{ base: '155px', lg: '160px' }}
                variant="filled"
            >
                <option value="SEVEN_DAY">last 7 days</option>
                <option value="THIRTY_DAY">last 30 days</option>
                <option value="NINETY_DAY">last 90 days</option>
                <option value="ONE_HUNDRED_EIGHTY_DAY">last 180 days</option>
                <option value="ONE_YEAR">last 365 days</option>
            </Select>
            <Box height="full">
                {stakingSnapshotData && <SftmxStatsFtmStakedFree data={stakingSnapshotData.snapshots} />}
            </Box>
        </Card>
    );
}
