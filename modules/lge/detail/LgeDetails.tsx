import { Box, Button, HStack, Menu, MenuButton, MenuItem, MenuList, TabList, Tabs, VStack } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { LgeDetailAboutThisLge } from './LgeDetailAboutThisLge';
import { LgeSwapsTable } from './LgeSwapsTable';
import { useLge } from '../lib/useLge';
import { usePool } from '~/modules/pool/lib/usePool';

type Props = {};

export function LgeDetails({ ...rest }: Props & BoxProps) {
    const { lge, status } = useLge();
    const { pool } = usePool();
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['About this lge', 'Swaps'];

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
                    {activeTab === 0 && lge && <LgeDetailAboutThisLge lge={lge} status={status} pool={pool} />}
                    {activeTab === 1 && <LgeSwapsTable />}
                </VStack>
            </Tabs>
        </Box>
    );
}
