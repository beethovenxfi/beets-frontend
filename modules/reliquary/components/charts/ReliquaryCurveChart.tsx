import Card from '~/components/card/Card';
import { EChartsOption, graphic } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { usePool } from '~/modules/pool/lib/usePool';
import { chartGetPrimaryColor } from '~/modules/pool/detail/components/charts/chart-util';
import { networkConfig } from '~/lib/config/network-config';
import { InfoButton } from '~/components/info-button/InfoButton';
import { HStack, Link } from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';

export function ReliquaryCurveChart() {
    const { pool } = usePool();

    const levels = pool.staking?.reliquary?.levels?.slice().sort((a, b) => a.level - b.level);
    const data = levels?.map((level) => ({
        level: level.level,
        allocationPoints: level.allocationPoints,
    }));

    const option: EChartsOption = {
        tooltip: {
            show: false,
        },
        xAxis: {
            type: 'value',
            splitLine: { show: false },
            interval: 1,
        },
        yAxis: {
            splitLine: { show: false },
        },
        grid: {
            left: '7.5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
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
        <Card height="full" minHeight="250px" px="4" py="8">
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
