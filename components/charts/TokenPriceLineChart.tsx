import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { GqlTokenPriceChartDataItem } from '~/apollo/generated/graphql-codegen-generated';
import { TokenBase } from '~/lib/services/token/token-types';

interface Props {
    tokenIn: TokenBase;
    tokenOut: TokenBase;
    prices: GqlTokenPriceChartDataItem[];
}

export function TokenPriceLineChart({ tokenIn, tokenOut, prices }: Props) {
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
                /*axisLabel: {
                    fontSize: 14,
                    formatter: (value: number) => format(value * 1000, 'MMM. dd'),
                },*/
            },
            yAxis: {
                show: false,
                scale: true,
                axisLine: { lineStyle: { color: '#8392A5' } },
                splitLine: { show: false },
                offset: 0,
            },
            width: '100%',
            height: '100%',
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
                    name: `${tokenOut.symbol}/${tokenIn.symbol}`,
                    showSymbol: false,
                    data: prices.map((item) => [item.timestamp * 1000, item.price]),
                    itemStyle: {
                        color: '#0CF49B',
                        color0: '#FD1050',
                        borderColor: '#0CF49B',
                        borderColor0: '#FD1050',
                    },
                },
            ],
        }),
        [],
    );

    return <ReactECharts option={option} style={{ height: '100%' }} />;
}
