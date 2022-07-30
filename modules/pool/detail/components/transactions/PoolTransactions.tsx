import { usePool } from '~/modules/pool/lib/usePool';
import { Box, HStack, TabList, Tabs, VStack } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useState } from 'react';
import { PoolDetailAboutThisPool } from '~/modules/pool/detail/components/PoolDetailAboutThisPool';
import { PoolSwapsTable } from '~/modules/pool/detail/components/transactions/PoolSwapsTable';
import { PoolJoinExitsTable } from '~/modules/pool/detail/components/transactions/PoolJoinExitsTable';
import { PoolUserInvestmentsTable } from '~/modules/pool/detail/components/transactions/PoolUserInvestmentsTable';

type Props = {};

export function PoolTransactions({ ...rest }: Props & BoxProps) {
    const [activeTab, setActiveTab] = useState(0);
    const { pool } = usePool();
    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable';

    return (
        <Box width="full" {...rest}>
            <Tabs variant="soft-rounded" onChange={setActiveTab}>
                <VStack width="full" alignItems="flex-start">
                    <TabList mb="2">
                        <HStack>
                            <BeetsTab>About this pool</BeetsTab>
                            <BeetsTab>{isPhantomStable ? 'Transactions' : 'Investments'}</BeetsTab>
                            {!isPhantomStable && <BeetsTab>Swaps</BeetsTab>}
                            <BeetsTab>My {isPhantomStable ? 'transactions' : 'investments'}</BeetsTab>
                        </HStack>
                    </TabList>
                    {activeTab === 0 && <PoolDetailAboutThisPool />}
                    {activeTab === 1 && <PoolJoinExitsTable />}
                    {activeTab === 2 && <PoolSwapsTable />}
                    {activeTab === 3 && <PoolUserInvestmentsTable />}
                </VStack>
            </Tabs>
        </Box>
    );
}
