import { Box, Button, HStack, Menu, MenuButton, MenuItem, MenuList, TabList, Tabs, VStack } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useState } from 'react';
import { PoolDetailAboutThisPool } from '~/modules/pool/detail/components/PoolDetailAboutThisPool';
import { PoolSwapsTable } from '~/modules/pool/detail/components/transactions/PoolSwapsTable';
import { PoolJoinExitsTable } from '~/modules/pool/detail/components/transactions/PoolJoinExitsTable';
import { PoolUserInvestmentsTable } from '~/modules/pool/detail/components/transactions/PoolUserInvestmentsTable';
import { ChevronDown } from 'react-feather';
import { PoolUserSwapsTable } from '~/modules/pool/detail/components/transactions/PoolUserSwapsTable';
import { usePool } from '~/modules/pool/lib/usePool';

type Props = {};

export function PoolTransactions({ ...rest }: Props & BoxProps) {
    const [activeTab, setActiveTab] = useState(0);
    const { pool, isComposablePool } = usePool();
    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable' && !isComposablePool;
    const tabs = [
        'About this pool',
        isPhantomStable ? 'Transactions' : 'Investments',
        ...(!isPhantomStable ? ['Swaps'] : []),
        `My ${isPhantomStable ? 'transactions' : 'investments'}`,
    ];

    return (
        <Box width="full" {...rest}>
            <Tabs variant="soft-rounded" onChange={setActiveTab}>
                <VStack width="full" alignItems="flex-start">
                    <Box width="full" display={{ base: 'block', md: 'none' }} mb="2">
                        <Menu matchWidth={true}>
                            <MenuButton as={Button} rightIcon={<ChevronDown />} width="full">
                                {tabs[activeTab]}
                            </MenuButton>
                            <MenuList>
                                {tabs.map((tab, index) => (
                                    <MenuItem onClick={() => setActiveTab(index)} key={index}>
                                        {tab}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                    <TabList display={{ base: 'none', md: 'block' }}>
                        <HStack mb="4">
                            {tabs.map((tab, index) => (
                                <BeetsTab key={index}>{tab}</BeetsTab>
                            ))}
                        </HStack>
                    </TabList>

                    {activeTab === 0 && <PoolDetailAboutThisPool />}
                    {activeTab === 1 && (isPhantomStable ? <PoolSwapsTable /> : <PoolJoinExitsTable />)}
                    {activeTab === 2 && (isPhantomStable ? <PoolUserSwapsTable /> : <PoolSwapsTable />)}
                    {activeTab === 3 && <PoolUserInvestmentsTable />}
                </VStack>
            </Tabs>
        </Box>
    );
}
