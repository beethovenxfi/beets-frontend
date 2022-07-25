import { BoxProps, useTheme } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { EChartsOption, graphic } from 'echarts';
import numeral from 'numeral';
import { format } from 'date-fns';

interface Props extends BoxProps {}

export function PoolDetailVolumeLiquidityChart({ ...rest }: Props) {
    const { colors } = useTheme();

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
                data: ['Liquidity', 'Daily Volume'],
                textStyle: {
                    color: colors.beets.base['50'],
                },
                top: '0',
                right: '2%',
            },
            grid: {
                bottom: '2.5%',
                right: '2.5%',
                left: '2.5%',
                top: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'time',
                minorSplitLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: function (value: number, index: number) {
                        return index % 3 === 0 ? format(new Date(value), 'MMM d') : '';
                    },
                    color: colors.gray['200'],
                },
                maxInterval: 3600 * 1000 * 24,
                axisPointer: {
                    type: 'line',
                    label: {
                        formatter: function (params) {
                            return format(new Date(params.value), 'MMM d');
                        },
                    },
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: colors.gray['300'],
                    },
                },
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
                        color: colors.beets.cyan,
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
                    max: 6000000, // align with left_axis
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
            color: ['rgba(0,255,255, 1.0)'],
            series: [
                {
                    data: [
                        [1656633600000, 51000000],
                        [1656720000000, 52000000],
                        [1656806400000, 59000000],
                        [1656892800000, 58000000],
                        [1656979200000, 54000000],
                        [1657065600000, 55000000],
                        [1657152000000, 57000000],
                        [1657238400000, 53000000],
                        [1657324800000, 51000000],
                        [1657411200000, 59000000],
                        [1657497600000, 58000000],
                        [1657584000000, 55000000],
                        [1657670400000, 52000000],
                    ],
                    name: 'Liquidity',
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
                            { offset: 0, color: 'rgba(0, 255, 255, 1)' },
                            { offset: 0.4, color: 'rgba(0, 255, 255, 0.5)' },
                            { offset: 1, color: 'rgba(0, 255, 255, 0.0)' },
                        ]),
                    },
                },
                {
                    data: [
                        [1656633600000, 4100000],
                        [1656720000000, 4200000],
                        [1656806400000, 4900000],
                        [1656892800000, 4800000],
                        [1656979200000, 4400000],
                        [1657065600000, 4500000],
                        [1657152000000, 4700000],
                        [1657238400000, 4300000],
                        [1657324800000, 4100000],
                        [1657411200000, 4900000],
                        [1657497600000, 4800000],
                        [1657584000000, 4500000],
                        [1657670400000, 4200000],
                    ],
                    name: 'Daily Volume',
                    type: 'line',
                    yAxisIndex: 1,

                    tooltip: {
                        valueFormatter: function (value) {
                            return `$${numeral(value).format('0a')}`;
                        },
                    },
                    symbol: 'circle',
                    symbolSize: 8,
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
        [],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
