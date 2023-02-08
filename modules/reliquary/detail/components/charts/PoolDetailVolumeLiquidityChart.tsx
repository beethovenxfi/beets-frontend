import { useTheme } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { EChartsOption, graphic } from 'echarts';
import numeral from 'numeral';
import { format } from 'date-fns';
import { chartGetPrimaryColor } from '~/modules/pool/detail/components/charts/chart-util';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props {
    data: { timestamp: number; totalLiquidity: string; volume24h: string }[];
    hideVolume?: boolean;
}

export function PoolDetailVolumeLiquidityChart({ data, hideVolume = false }: Props) {
    const { colors } = useTheme();
    const networkConfig = useNetworkConfig();

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
            legend: {
                show: false,
                data: ['TVL', 'Daily Volume'],
                textStyle: {
                    color: colors.beets.base['50'],
                },
                top: '0',
                right: '2%',
            },
            grid: {
                bottom: '2%',
                right: '1.5%',
                left: '1.5%',
                top: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'time',
                minorSplitLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: (value: number, index: number) => {
                        return format(new Date(value), 'MMM d');
                    },
                    color: colors.gray['200'],
                    interval: 'auto',

                    showMaxLabel: false,
                    showMinLabel: false,
                },
                //maxInterval: 3600 * 1000 * 24,
                axisPointer: {
                    type: 'line',
                    label: {
                        formatter: (params) => {
                            return format(new Date(params.value), 'MMM d');
                        },
                    },
                },
                axisLine: { show: false },
            },
            yAxis: [
                {
                    type: 'value',
                    axisLine: { show: false },
                    minorSplitLine: { show: false },
                    splitLine: { show: false },
                    axisLabel: {
                        formatter: function (value: number, index: number) {
                            return index % 3 === 1 ? `$${numeral(value).format('0a')}` : '';
                        },
                        color: colors.beets.base['100'],
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return `$${numeral(params.value).format('0a')}`;
                            },
                        },
                    },
                },
                {
                    type: 'value',
                    //max: 6000000, // align with left_axis
                    axisLine: { show: false },
                    minorSplitLine: { show: false },
                    splitLine: { show: false },
                    axisLabel: {
                        formatter: function (value: number, index: number) {
                            return index % 3 === 1 ? `$${numeral(value).format('0a')}` : '';
                        },
                        color: colors.white,
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return `$${numeral(params.value).format('0a')}`;
                            },
                        },
                    },
                },
            ],
            series: [
                {
                    data: data.map((item) => [item.timestamp * 1000, item.totalLiquidity]),
                    name: 'TVL',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return `$${numeral(value).format('0a')}`;
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
                {
                    data: hideVolume ? [] : data.map((item) => [item.timestamp * 1000, item.volume24h]),
                    name: 'Daily Volume',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: function (value) {
                            return `$${numeral(value).format('0a')}`;
                        },
                    },
                    symbol: 'circle',
                    symbolSize: data.length > 60 ? 6 : 8,
                    itemStyle: {
                        color: colors.black,
                        borderColor: colors.white,
                        borderWidth: 1.5,
                    },
                    lineStyle: {
                        color: colors.white,
                    },
                },
            ],
        }),
        [JSON.stringify(data)],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
