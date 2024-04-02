import Card from '~/components/card/Card';
import { SftmxStatsRateCharts } from './SftmxStatsRateCharts';

export function SftmxStatsRateChartsCard() {
    return (
        <Card shadow="lg" h="full" p="4" title="FTM staked">
            <SftmxStatsRateCharts />
        </Card>
    );
}
