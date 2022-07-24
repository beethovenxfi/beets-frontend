import { Text, BoxProps, Box, VStack, HStack, useTheme } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import Card from '~/components/card/Card';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { EChartsOption } from 'echarts';
import numeral from 'numeral';
import { format } from 'date-fns';

interface Props extends BoxProps {}

function PoolDetailChart({ ...rest }: Props) {
    const theme: any = useTheme();
    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                show: true,
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
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',
                    },
                },
            },
            legend: {
                data: ['Daily Volume', 'Liquidity'],
                textStyle: {
                    color: 'white',
                },
            },
            grid: {
                bottom: '5%',
                right: '5%',
                left: '5%',
                top: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'time',
                minorSplitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                // axisLine: {
                //     lineStyle: {
                //         color: theme.colors.beets.base['100'],
                //     },
                // },
                axisLabel: {
                    formatter: function (value: number) {
                        return format(new Date(value), 'MMMM d');
                    },
                    rotate: 30,
                },
                maxInterval: 3600 * 1000 * 24,
                axisPointer: {
                    type: 'line',
                    label: {
                        formatter: function (params) {
                            return format(new Date(params.value), 'MMMM d');
                        },
                    },
                },
            },
            yAxis: [
                {
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
                    axisLabel: {
                        formatter: function (value: number) {
                            return `$${numeral(value).format('0a')}`;
                        },
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
                    axisLabel: {
                        formatter: function (value: number) {
                            return `$${numeral(value).format('0a')}`;
                        },
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
                    itemStyle: {
                        borderRadius: [5, 5, 0, 0],
                    },
                    tooltip: {
                        valueFormatter: function (value) {
                            return `$${numeral(value).format('0a')}`;
                        },
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
                    color: 'black',
                    tooltip: {
                        valueFormatter: function (value) {
                            return `$${numeral(value).format('0a')}`;
                        },
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
