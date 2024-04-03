import Card from '~/components/card/Card';
import { SftmxStatsCharts } from './SftmxStatsCharts';

export function SftmxStatsChartsCard() {
    return (
        <Card shadow="lg" h="full" p="4" title="FTM staked">
            <SftmxStatsCharts />
        </Card>
    );
}
