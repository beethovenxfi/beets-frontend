import { Box } from '@chakra-ui/layout';
import { EChartsOption, graphic } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { GqlTokenPriceChartDataItem } from '~/apollo/generated/graphql-codegen-generated';
import { useTheme } from '@chakra-ui/react';
import { format } from 'date-fns';

interface Props {
    label: string;
    prices: GqlTokenPriceChartDataItem[];
    priceValueFormatter: (value: number) => string;
}

export function TokenPriceLineChart({ label, prices, priceValueFormatter }: Props) {
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
                show: false,
                type: 'time',
                axisLine: { lineStyle: { color: '#8392A5' } },
                offset: 0,
                axisLabel: {
                    fontSize: 14,
                    formatter: (value: number) => format(value * 1000, 'd. MMM HH:mm'),
                },
                axisPointer: {
                    type: 'line',
                    label: {
                        formatter: (params) => {
                            return format(new Date(params.value), 'd. MMM HH:mm');
                        },
                    },
                },
            },
            yAxis: {
                show: false,
                scale: true,
                //axisLine: { lineStyle: { color: '#8392A5' } },
                splitLine: { show: false },
                offset: 0,
                max,
            },
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                containLabel: false,
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    name: label,
                    showSymbol: false,
                    data: prices.map((item) => [item.timestamp * 1000, item.price]),
                    itemStyle: {
                        color: colors.beets.highlight,
                        borderColor: colors.beets.highlight,
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0, 255, 255,0.5)' },
                            { offset: 1, color: 'rgba(0, 255, 255, 0)' },
                        ]),
                    },
                    tooltip: {
                        valueFormatter: (value) => priceValueFormatter(value as number),
                    },
                },
            ],
        }),
        [label, prices],
    );

    return (
        <Box width="full" height="full">
            <ReactECharts option={option} style={{ height: '100%' }} />
        </Box>
    );
}
