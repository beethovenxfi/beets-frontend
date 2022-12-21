import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useMemo } from 'react';
import Card from '~/components/card/Card';
import ReactECharts from 'echarts-for-react';
import { EChartsOption, graphic } from 'echarts';
import useReliquary from '../lib/useReliquary';

interface Props {}

export default function RelicMaturity({}: Props) {
    const { maturityThresholds, isLoading, selectedRelic } = useReliquary();

    const chartData = useMemo(() => {
        const relicStart = selectedRelic?.entry;
        console.log('sart', relicStart, maturityThresholds);
        return maturityThresholds
            .map((maturityThreshold, i) => {
                const threshold = parseInt(maturityThreshold, 10);
                const nextThreshold = parseInt(maturityThresholds[i + 1], 10);
                if (!maturityThresholds[i + 1]) return [];
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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            grid: {
                left: '1%',
                bottom: 0,
                right: '1%',
                top: '2%',
            },
            toolbox: {
                show: false,
                feature: {
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: 'category',
                show: false,
                boundaryGap: false,
                data: maturityThresholds,
            },
            yAxis: {
                show: false,
                type: 'value',
                axisLabel: {
                    formatter: '{value} W',
                },
                axisPointer: {
                    snap: true,
                },
            },
            visualMap: {
                show: false,
                dimension: 0,
                pieces: [
                    {
                        lte: 8,
                        color: '#00FFFF',
                    },

                    {
                        gt: 8,
                        lte: 14,
                        color: '#00FFFF',
                    },
                    {
                        gt: 14,
                        color: '#FF0000',
                    },
                ],
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.2,
                    },
                    // prettier-ignore
                    data: [1,2.5,3.8,4,6,9,10,10.1,10.2,10.3],
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
