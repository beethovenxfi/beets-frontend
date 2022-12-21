import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useMemo } from 'react';
import Card from '~/components/card/Card';
import ReactECharts from 'echarts-for-react';
import { EChartsOption, graphic } from 'echarts';
import useReliquary from '../hooks/useReliquary';

interface Props {}

export default function RelicMaturity({}: Props) {
    const { maturityThresholds, isLoading, currentRelicPosition } = useReliquary();

    const chartData = useMemo(() => {
        const relicStart = currentRelicPosition?.entry;
        console.log('sart', relicStart, maturityThresholds);
        return maturityThresholds
            .map((maturityThreshold, i) => {
                const threshold = parseInt(maturityThreshold, 10);
                const nextThreshold = parseInt(maturityThresholds[i + 1], 10);
                if (!maturityThresholds[i + 1]) return []
                return [threshold, nextThreshold, i + 1, `Level ${i + 1}`];
            })
            .map(function (item, index) {
                return {
                    value: item,
                    itemStyle: {
                        color: '#00F89C',
                    },
                };
            });
    }, [isLoading]);
    const chartOption: EChartsOption = useMemo(() => {
        return {
            title: {
                show: false,
            },
            tooltip: {},
            xAxis: {
                scale: true,
                splitLine: { show: false },
                show: false,
            },
            yAxis: {
                splitLine: { show: false },
                show: false,
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
            },
            series: [
                {
                    type: 'custom',
                    renderItem: function (params: any, api: any) {
                        var yValue = api.value(2);
                        var start = api.coord([api.value(0), yValue]);
                        var size = api.size([api.value(1) - api.value(0), yValue]);
                        var style = api.style();
                        return {
                            type: 'rect',
                            shape: {
                                x: start[0],
                                y: start[1],
                                width: size[0] - 2,
                                height: size[1],
                            },
                            style: style,
                        };
                    },
                    label: {
                        show: true,
                        position: 'top',
                    },
                    dimensions: ['from', 'to', 'profit'],
                    encode: {
                        x: [0, 1],
                        y: 2,
                        tooltip: [0, 1, 2],
                        itemName: 3,
                    },
                    data: chartData,
                },
            ],
        };
    }, [isLoading]);
    return (
        <Card p="4" width="full">
            <VStack spacing="2">
                <HStack width="full" spacing="12" alignItems="flex-start">
                    <VStack spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Projected Maturity
                        </Text>
                    </VStack>
                </HStack>
                <Box width="full" height="200px">
                    <ReactECharts showLoading={isLoading} option={chartOption} style={{ height: '100%' }} />
                </Box>
            </VStack>
        </Card>
    );
}
