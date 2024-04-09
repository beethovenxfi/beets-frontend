import { useMemo } from 'react';
import { EChartsOption } from 'echarts';
import { format } from 'date-fns';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import ReactECharts from 'echarts-for-react';
import { useBreakpointValue, useTheme } from '@chakra-ui/react';
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
    const { colors } = useTheme();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const gridLeft = isMobile ? '12%' : '5%';

    const option = useMemo<EChartsOption>(
        () => ({
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
                },
            ],
        }),
        [JSON.stringify(data), gridLeft],
    );

    return <ReactECharts option={option} style={{ height: isMobile ? '400px' : '100%', width: '100%' }} />;
}
