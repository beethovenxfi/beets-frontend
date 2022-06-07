import ReactECharts from 'echarts-for-react';
import { Box, VStack } from '@chakra-ui/layout';
import { useTheme } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useState } from 'react';

export function PoolCompositionChart() {
    const { pool } = usePool();
    const theme = useTheme();
    const [hoveredToken, setHoveredToken] = useState();

    const chartData = pool.tokens.map((token) => ({ value: token.weight, name: token.symbol }));
    const option = {
        tooltip: {
            trigger: 'item',
            show: false,
        },
        legend: {
            show: false,
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#100A49',
                    borderWidth: 2,
                },
                roseType: 'radius',
                label: {
                    show: false,
                    position: 'center',
                },
                color: [
                    'rgba(0,255,255, 1.0)',
                    'rgba(0,255,255, 0.8)',
                    'rgba(0,255,255, 0.6)',
                    'rgba(0,255,255, 0.4)',
                    'rgba(0,255,255, 0.2)',
                ],
                labelLine: {
                    show: false,
                },
                data: chartData,
            },
        ],
    };

    return (
        <VStack>
            <Box width="full">
                <ReactECharts option={option} style={{ height: '150px' }} />
            </Box>
        </VStack>
    );
}
