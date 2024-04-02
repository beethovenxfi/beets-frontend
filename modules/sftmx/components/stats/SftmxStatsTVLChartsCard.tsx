import Card from '~/components/card/Card';
import { SftmxStatsTVLCharts } from './SftmxStatsTVLCharts';

export function SftmxStatsTVLChartsCard() {
    return (
        <Card shadow="lg" h="full" p="4" title="FTM staked">
            <SftmxStatsTVLCharts />
        </Card>
    );
}
