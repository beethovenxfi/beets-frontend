import { useMemo } from 'react';
import { EChartsOption } from 'echarts';
import { format } from 'date-fns';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@chakra-ui/react';
import numeral from 'numeral';

interface DataProps {
    timestamp: number;
    exchangeRate: string;
    totalFtmAmount: string;
    totalFtmAmountInPool: string;
    totalFtmAmountStaked: string;
}
interface Props {
    data: DataProps[];
}

export function SftmxStatsFtmStakedFree({ data }: Props) {
    const { colors } = useTheme();

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                trigger: 'axis',
                type: 'shadow',
                backgroundColor: colors.beets.base['700'],
                borderColor: 'transparent',
                borderRadius: 8,
                textStyle: {
                    color: 'white',
                },
                padding: 16,
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: colors.beets.base['100'],
                        width: 2,
                        opacity: 1,
                    },
                },
                // any -> https://github.com/apache/echarts/issues/14277
                formatter: (params: any) => `Total: ${numeral(params[0].data[1]).format('0.[00]a')}<br />
                                            Total staked: ${numeral(params[1].data[1]).format('0.[00]a')}<br />
                                            Total free: ${numeral(params[2].data[1]).format('0.[00]a')}`,
            },
            xAxis: {
                show: true,
                type: 'time',
                offset: 0,
                minorSplitLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    formatter: (value: number, index: number) => {
                        return index % 2 === 0 ? format(new Date(value), 'MMM d') : '';
                    },
                    color: colors.gray['200'],
                    showMaxLabel: false,
                    showMinLabel: false,
                },
                axisPointer: {
                    type: 'line',
                    label: {
                        formatter: (params) => {
                            return format(new Date(params.value), 'MMM d yyyy');
                        },
                    },
                },
                axisLine: { show: false },
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                minorSplitLine: { show: false },
                splitLine: { show: false },
                axisLabel: {
                    formatter: function (value: number, index: number) {
                        return index % 2 === 1 ? `$${numeral(value).format('0a')}` : '';
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
            grid: {
                left: '5%',
                right: 0,
                top: '5%',
                bottom: '7.5%',
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    name: 'Total FTM amount',
                    showSymbol: false,
                    data: data.map((item) => [
                        item.timestamp * 1000,
                        parseInt(item.totalFtmAmountInPool) + parseInt(item.totalFtmAmountStaked),
                    ]),
                    itemStyle: {
                        color: colors.beets.base['100'],
                    },
                    axisLine: { show: false },
                    minorSplitLine: { show: false },
                    splitLine: { show: false },
                    tooltip: {
                        valueFormatter: (value) => numberFormatUSDValue(value as number),
                    },
                },
                {
                    type: 'line',
                    smooth: true,
                    name: 'Total FTM amount staked',
                    showSymbol: false,
                    data: data.map((item) => [item.timestamp * 1000, parseInt(item.totalFtmAmountStaked)]),
                    itemStyle: {
                        color: colors.beets.base['200'],
                    },
                    axisLine: { show: false },
                    minorSplitLine: { show: false },
                    splitLine: { show: false },
                    tooltip: {
                        valueFormatter: (value) => numberFormatUSDValue(value as number),
                    },
                },
                {
                    type: 'line',
                    smooth: true,
                    name: 'Total FTM amount in pool',
                    showSymbol: false,
                    data: data.map((item) => [item.timestamp * 1000, parseInt(item.totalFtmAmountInPool)]),
                    itemStyle: {
                        color: colors.beets.base['300'],
                    },
                    axisLine: { show: false },
                    minorSplitLine: { show: false },
                    splitLine: { show: false },
                    tooltip: {
                        valueFormatter: (value) => numberFormatUSDValue(value as number),
                    },
                },
            ],
        }),
        [JSON.stringify(data)],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
