import { useMemo, useState } from 'react';
import { GqlTokenChartDataRange, useGetPoolBptPriceChartDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { usePool } from '~/modules/pool/lib/usePool';
import { EChartsOption, graphic } from 'echarts';
import { format } from 'date-fns';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@chakra-ui/react';

interface Props {
    prices: { timestamp: number; price: string }[];
}

export function PoolDetailBptPriceChart({ prices }: Props) {
    const { colors } = useTheme();
    const max = Math.max(...prices.map((price) => parseFloat(price.price))) * 1.01;

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                trigger: 'axis',
                type: 'shadow',
                backgroundColor: 'rgba(24, 24, 46, 0.95)',
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
                        color: '#376df4',
                        width: 2,
                        opacity: 1,
                    },
                },
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
                            return format(new Date(params.value), 'MMM d');
                        },
                    },
                },
                axisLine: { show: false },
            },
            yAxis: {
                show: false,
                scale: true,
                splitLine: { show: false },
                offset: 0,
                max,
            },
            grid: {
                left: 0,
                right: 0,
                top: '5%',
                bottom: '7.5%',
                containLabel: false,
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    name: 'BPT price',
                    showSymbol: false,
                    data: prices.map((item) => [item.timestamp * 1000, item.price]),
                    itemStyle: {
                        color: colors.beets.base['100'],
                        borderColor: 'rgba(88, 95, 198, 1)',
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(88, 95, 198, 1)' },
                            { offset: 0.5, color: 'rgba(88, 95, 198, 1)' },
                            { offset: 1, color: 'rgba(88, 95, 198, 0.0)' },
                        ]),
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
        [JSON.stringify(prices)],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
