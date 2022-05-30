import ReactECharts from 'echarts-for-react';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolCompositionChart() {
    const { pool } = usePool();
    const { priceFor } = useGetTokens();

    const data = pool.tokens.map((token) => {
        return {
            value: token.weight
                ? parseFloat(token.weight)
                : (parseFloat(token.balance) * priceFor(token.address)) / parseFloat(pool.dynamicData.totalLiquidity),
            name: token.symbol,
        };
    });

    const option = {
        backgroundColor: 'transparent',
        series: [
            {
                name: 'Token',
                type: 'pie',
                radius: ['40%', '70%'],
                data: data.sort(function (a, b) {
                    return a.value - b.value;
                }),
                label: {
                    formatter: '{b}: {d}%',
                    fontSize: 10,
                    color: '#fff',
                },
                silent: true,
                startAngle: 160,
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '250px' }} />;
}
