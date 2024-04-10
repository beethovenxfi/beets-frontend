import { useMemo } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useBreakpointValue } from '@chakra-ui/react';
import numeral from 'numeral';

interface DataProps {
    timestamp: number;
    exchangeRate: string;
    totalFtmAmount: string;
    totalFtmAmountInPool: string;
    totalFtmAmountStaked: string;
}
interface Props {
    data: any[];
}

export function SftmxChartsFtmValidator({ data }: Props) {
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const option = useMemo<EChartsOption>(
        () => ({
            darkMode: true,
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    type: 'pie',
                    data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                    width: '100%',
                    label: {
                        overflow: 'none',
                    },
                    tooltip: {
                        valueFormatter: (value) => `${numeral(value as number).format('0.[00]a')} FTM staked`,
                    },
                },
            ],
        }),
        [JSON.stringify(data)],
    );

    return <ReactECharts option={option} style={{ height: isMobile ? '400px' : '100%', width: '100%' }} />;
}
