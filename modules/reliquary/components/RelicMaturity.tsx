import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useMemo } from 'react';
import Card from '~/components/card/Card';
import ReactECharts from 'echarts-for-react';
import { EChartsOption, graphic } from 'echarts';
import { format, fromUnixTime } from 'date-fns';
import useReliquary from '../lib/useReliquary';
import { InfoButton } from '~/components/info-button/InfoButton';

interface Props {}

export default function RelicMaturity({}: Props) {
    const { maturityThresholds, isLoading, selectedRelic } = useReliquary();
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
                valueFormatter: (value) => `Level ${value}`,
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
                data: maturityThresholds.map((threshold) => {
                    return format(
                        fromUnixTime((selectedRelic?.entry || 0) + parseInt(threshold, 10)),
                        'dd/MM/yyyy HH:mm',
                    );
                }),
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
                    step: 'middle',
                    // prettier-ignore
                    data: maturityThresholds.map((_, i) => i + 1),
                },
            ],
        };
    }, [isLoading]);
    return (
        <Card px="2" py="4" h="full">
            <VStack spacing="2">
                <HStack w="full" spacing="12" alignItems="flex-start">
                    <VStack spacing="0" alignItems="flex-start">
                        <InfoButton
                            labelProps={{
                                lineHeight: '1rem',
                                fontWeight: 'semibold',
                                fontSize: 'sm',
                                color: 'beets.base.50',
                            }}
                            label="Projected maturity"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                    </VStack>
                </HStack>
                <Box w="full" h="150px">
                    <ReactECharts showLoading={isLoading} option={chartOption} style={{ height: '100%' }} />
                </Box>
            </VStack>
        </Card>
    );
}
