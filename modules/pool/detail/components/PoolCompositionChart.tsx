import ReactECharts from 'echarts-for-react';
import { Box } from '@chakra-ui/layout';
import { useTheme } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolCompositionChart() {
    const { pool } = usePool();
    const theme = useTheme();

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
        },
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1],
            },
        },
        series: [
            {
                name: 'Token',
                type: 'pie',
                radius: '100%',
                center: ['50%', '50%'],
                height: '100%',
                data: [
                    { value: 335, name: 'Direct' },
                    { value: 310, name: 'Email' },
                    { value: 274, name: 'Union Ads' },
                    { value: 235, name: 'Video Ads' },
                    { value: 400, name: 'Search Engine' },
                ].sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    position: 'inside',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                },
                /*labelLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)',
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20,
                },*/
                itemStyle: {
                    color: theme.colors.beets.navy['400'],
                    //shadowBlur: 200,
                    //shadowColor: 'rgba(0, 0, 0, 0.2)',
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx: number) {
                    return Math.random() * 200;
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '275px' }} />;
}
