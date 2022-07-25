import { HStack, Select } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { PoolDetailBptPriceChart } from '~/modules/pool/detail/components/charts/PoolDetailBptPriceChart';
import { usePool } from '~/modules/pool/lib/usePool';
import { useState } from 'react';
import { PoolDetailVolumeLiquidityChart } from '~/modules/pool/detail/components/charts/PoolDetailVolumeLiquidityChart';

type ChartType = 'SHARE_PRICE' | 'VOLUME_TVL';
type ChartRange = 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'ALL_TIME';

export function PoolDetailCharts() {
    const { pool } = usePool();
    const [chartType, setChartType] = useState<ChartType>('SHARE_PRICE');
    const [chartRange, setChartRange] = useState<ChartRange>('SEVEN_DAYS');

    return (
        <Card>
            <HStack padding="4" pb="0" spacing="4">
                <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.currentTarget.value as ChartType)}
                    width="180px"
                    variant="filled"
                >
                    <option value="SHARE_PRICE">Share price</option>
                    <option value="VOLUME_TVL">Liquidity / TVL</option>
                </Select>
                <Select
                    value={chartRange}
                    onChange={(e) => setChartRange(e.currentTarget.value as ChartRange)}
                    width="140px"
                    variant="filled"
                >
                    <option value="SEVEN_DAYS">last 7 days</option>
                    <option value="THIRTY_DAYS">last 30 days</option>
                    <option value="ALL_TIME">All time</option>
                </Select>
            </HStack>

            {chartType === 'SHARE_PRICE' && <PoolDetailBptPriceChart />}
            {chartType === 'VOLUME_TVL' && <PoolDetailVolumeLiquidityChart />}
        </Card>
    );
}
