import Card from '~/components/card/Card';
import { EChartsOption, graphic } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { usePool } from '~/modules/pool/lib/usePool';
import { chartGetPrimaryColor } from '~/modules/pool/detail/components/charts/chart-util';
import { networkConfig } from '~/lib/config/network-config';
import { InfoButton } from '~/components/info-button/InfoButton';
import { HStack, Link } from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';
import numeral from 'numeral';

export function ReliquaryCurveChart() {
    const { pool } = usePool();

    const data = pool.staking?.reliquary?.levels?.map((level) => ({
        level: level.level,
        allocationPoints: level.allocationPoints,
    }));

    const option: EChartsOption = {
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999',
                },
            },
            // any -> https://github.com/apache/echarts/issues/14277
            formatter: (params: any) =>
                `Level ${params[0].data[0]}: ${numeral(params[0].data[1]).format('0a')} allocation points`,
        },
        xAxis: {
            name: 'Levels',
            nameLocation: 'middle',
            nameGap: 35,
            type: 'value',
            splitLine: { show: false },
            interval: 1,
            axisLabel: {
                margin: 12,
            },
            axisPointer: {
                label: {
                    formatter: (params) => numeral(params.value).format('0a'),
                },
            },
        },
        yAxis: {
            splitLine: { show: false },
            name: 'Allocation Points',
            nameLocation: 'middle',
            nameRotate: 90,
            nameGap: 35,
        },
        grid: {
            left: '10%',
            right: '5%',
            top: '10%',
            bottom: '22.5%',
            containLabel: false,
        },
        series: [
            {
                type: 'line',
                smooth: true,
                name: 'BEETronix',
                data: data?.map((item) => [item.level, item.allocationPoints]),
                areaStyle: {
                    opacity: networkConfig.chainId === '10' ? 0.75 : 0.2,
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: chartGetPrimaryColor(networkConfig.chainId, 1) },
                        { offset: 0.5, color: chartGetPrimaryColor(networkConfig.chainId, 1) },
                        { offset: 1, color: chartGetPrimaryColor(networkConfig.chainId, 0) },
                    ]),
                },
            },
        ],
    };

    return (
        <Card height="full" minHeight="250px" px="4" py="4">
            <HStack>
                <InfoButton
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                    label="BEETronix"
                    infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                />
                <Link href="link.to.docs" target="_blank">
                    <ExternalLink size="16" />
                </Link>
            </HStack>
            <ReactECharts option={option} style={{ height: '100%' }} />
        </Card>
    );
}
