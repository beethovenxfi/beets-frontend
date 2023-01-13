import { useTheme } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { EChartsOption, graphic } from 'echarts';
import numeral from 'numeral';
import { format } from 'date-fns';
import { chartGetPrimaryColor } from '~/modules/pool/detail/components/charts/chart-util';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';

export function ReliquaryMaturityChart() {
    const { pool } = usePool();
    const { colors } = useTheme();
    const networkConfig = useNetworkConfig();

    const levels = pool.staking?.reliquary?.levels?.slice().sort((a, b) => a.level - b.level);

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',
                    },
                },
            },
            grid: {
                bottom: '2%',
                right: '1.5%',
                left: '1.5%',
                top: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                splitLine: { show: false },
                axisTick: { show: true, length: 10 },
                axisLabel: {
                    formatter: (value: number, index: number) => {
                        return value - 1;
                    },
                    color: colors.gray['200'],
                    interval: 'auto',
                    showMaxLabel: false,
                    showMinLabel: false,
                },
                axisLine: { show: true },
            },
            yAxis: {
                type: 'value',
                axisLine: { show: true },
                minorSplitLine: { show: false },
                splitLine: { show: false },
                axisLabel: {
                    formatter: function (value: number, index: number) {
                        return `$${numeral(value).format('0a')}`;
                    },
                    color: colors.beets.base['100'],
                    showMinLabel: false,
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return `$${numeral(params.value).format('0a')}`;
                        },
                    },
                },
            },
            series: [
                {
                    data: levels?.map((level) => [level.level + 1, level.balance]),
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return numeral(value).format('0a');
                        },
                    },
                    itemStyle: {
                        opacity: 1,
                        borderRadius: [5, 5, 0, 0],
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: chartGetPrimaryColor(networkConfig.chainId, 1) },
                            { offset: 0.5, color: chartGetPrimaryColor(networkConfig.chainId, 0.7) },
                            { offset: 1, color: chartGetPrimaryColor(networkConfig.chainId, 0) },
                        ]),
                    },
                },
            ],
        }),
        [JSON.stringify(levels)],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
