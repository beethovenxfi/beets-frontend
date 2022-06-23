import { HStack, TabList, Tabs } from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import { useAccount } from 'wagmi';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useUserAccount } from '~/lib/user/useUserAccount';

const TABS = [
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

export function PoolListTabs() {
    const { isConnected } = useUserAccount();
    const { state, refetch: refreshPoolList, setShowMyInvestments, showMyInvestments } = usePoolList();
    const categoryIn = state.where?.categoryIn;

    const handleTabChanged = (index: number) => {
        const tab = TABS[index];
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
        <Tabs variant="soft-rounded" display="flex" onChange={handleTabChanged}>
            <TabList>
                <HStack spacing="2">
                    {TABS.map((tab) => (
                        <BeetsTab key={tab.id}>{tab.text}</BeetsTab>
                    ))}
                </HStack>
            </TabList>
        </Tabs>
    );
}
