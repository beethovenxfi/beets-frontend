import { Heading, VStack } from '@chakra-ui/react';
import Card from '~/components/card/Card';

export default function SftmxStatsTab() {
    return (
        <Card shadow="lg" h="full">
            <VStack spacing="4" p="4" align="flex-start" h="full">
                <Heading size="md">Stats</Heading>
            </VStack>
        </Card>
    );
}
