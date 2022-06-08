import { Text, BoxProps, Box, VStack, HStack, useTheme } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import Card from '~/components/card/Card';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { EChartsOption } from 'echarts';

interface Props extends BoxProps {}

function PoolDetailChart({ ...rest }: Props) {
    const theme: any = useTheme();
    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                show: false,
                // trigger: 'axis',
                // type: 'shadow',
                // backgroundColor: 'rgba(24, 24, 46, 0.95)',
                // borderColor: 'transparent',
                // borderRadius: 8,
                // textStyle: {
                //     color: 'white',
                // },
                // padding: 16,
                // axisPointer: {
                //     animation: false,
                //     type: 'cross',
                //     lineStyle: {
                //         color: '#376df4',
                //         width: 2,
                //         opacity: 1,
                //     },
                // },
            },
            grid: {
                bottom: '10%',
                right: '5%',
                left: '5%',
                top: '4%',
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
                minorSplitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: theme.colors.beets.base['100'],
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: theme.colors.beets.base['100'],
                    },
                },
                minorSplitLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            color: ['rgba(0,255,255, 1.0)'],
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130, 200, 500, 50, 150],
                    type: 'bar',
                    itemStyle: {
                        borderRadius: [5, 5, 0, 0],
                    },
                },
            ],
        }),
        [],
    );

    return (
        <Card width="full" display="flex" alignItems="center" justifyContent="center" height="full">
            <VStack width="full" height="full">
                <HStack width="full" padding="4">
                    <Text as="h2" fontSize="3xl" fontWeight="bold" color="beets.base.50">
                        $4.23m
                    </Text>
                </HStack>
                <Box width="full" height="full">
                    <ReactECharts option={option} style={{ height: '100%' }} />
                </Box>
            </VStack>
    </Card>
    );
}

export default PoolDetailChart;
