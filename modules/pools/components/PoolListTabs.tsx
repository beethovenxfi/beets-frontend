import { Box, Flex, HStack, Tabs, Tab, TabList, useTab, Button } from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import { useAccount } from 'wagmi';
import BeetsTab from '~/components/tabs/BeetsTab';
import { forwardRef } from 'react';

export function PoolListTabs() {
    const { data: accountData } = useAccount();
    const connected = !!accountData?.address;
    const { state, refetch: refreshPoolList, setShowMyInvestments, showMyInvestments } = usePoolList();
    const categoryIn = state.where?.categoryIn;

    const tabs = [
        {
            text: 'Incentivized pools',
            id: 'incentivized',
        },
        {
            text: 'Community pools',
            id: 'community',
        },
        {
            text: 'My investments',
            id: 'my-investments',
        },
    ];

    const handleTabChanged = (tab: any) => {
        const categoryNotIn: any = tab.id === 'community' ? ['INCENTIVIZED'] : null;
        const categoryIn: any = tab.id === 'incentivized' ? ['INCENTIVIZED'] : null;

        if (['incentivized', 'community'].includes(tab.id)) {
            setShowMyInvestments(false);
            refreshPoolList({
                ...state,
                skip: 0,
                where: {
                    ...state.where,
                    categoryIn,
                    categoryNotIn,
                },
            });
        } else {
            if (!showMyInvestments) {
                setShowMyInvestments(true);
            }
        }
    };

    return (
        <Tabs variant="soft-rounded" display="flex">
            <TabList>
                <HStack spacing='2'>
                    {tabs.map((tab) => (
                        <BeetsTab key={tab.id}>{tab.text}</BeetsTab>
                    ))}
                </HStack>
            </TabList>
        </Tabs>
    );
}
