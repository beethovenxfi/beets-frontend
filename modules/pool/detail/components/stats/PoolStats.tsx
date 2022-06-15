import { Divider, HStack, Text, VStack, Badge } from '@chakra-ui/layout';
import Card from '~/components/card/Card';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import PoolUserStats from './PoolUserStats';
import PoolOverallStats from './PoolOverallStats';
import { TabList, Tabs } from '@chakra-ui/tabs';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useState } from 'react';

export default function PoolStats() {
    const { isLoading, hasBpt } = usePoolUserPoolTokenBalances();
    const { pool, poolTokensWithoutPhantomBpt } = usePool();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChanged = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };
    return (
        <Card padding="4" minWidth="300px" width="300px" height="full">
            <VStack height="full" spacing="4">
                {hasBpt && (
                    <Tabs variant="soft-rounded" display="flex" onChange={handleTabChanged}>
                        <TabList>
                            <HStack spacing="2">
                                <BeetsTab paddingX="4" paddingY="2" fontSize="xs">
                                    Your Stats
                                </BeetsTab>
                                <BeetsTab paddingX="4" paddingY="2" fontSize="xs">
                                    Pool Stats
                                </BeetsTab>
                            </HStack>
                        </TabList>
                    </Tabs>
                )}
                {hasBpt && activeTab === 0 && <PoolUserStats />}
                {(!hasBpt || activeTab === 1) && <PoolOverallStats />}
            </VStack>
        </Card>
    );
}
