import { Heading, VStack } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { SftmxStats } from './components/stats/SftmxStats';

export default function SftmxStatsTab() {
    return (
        <Card shadow="lg" h="full" p="4">
            <SftmxStats />
        </Card>
    );
}
