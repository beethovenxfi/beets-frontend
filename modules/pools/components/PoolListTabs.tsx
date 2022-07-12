import { Box, HStack, TabList, Tabs } from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function PoolListTabs() {
    const { isConnected } = useUserAccount();
    const { state, refetch: refreshPoolList, setShowMyInvestments, showMyInvestments } = usePoolList();
    const TABS = [{ id: 'incentivized' }, { id: 'community' }, { id: 'my-investments' }];

    const handleTabChanged = (index: number) => {
        const tab = TABS[index];
        const categoryNotIn: any = tab.id === 'community' ? ['INCENTIVIZED'] : null;
        const categoryIn: any = tab.id === 'incentivized' ? ['INCENTIVIZED'] : null;

        if (['incentivized', 'community'].includes(tab.id)) {
            setShowMyInvestments(false);
            refreshPoolList({
                ...state,
                skip: 0,
                first: 20,
                where: {
                    ...state.where,
                    categoryIn,
                    categoryNotIn,
                    idIn: undefined,
                },
            });
        } else {
            if (!showMyInvestments) {
                setShowMyInvestments(true);
            }
        }
    };

    return (
        <Tabs
            variant="soft-rounded"
            display="flex"
            onChange={handleTabChanged}
            defaultIndex={showMyInvestments ? 2 : state.where?.categoryIn?.includes('INCENTIVIZED') ? 0 : 1}
        >
            <TabList>
                <HStack spacing="2">
                    <BeetsTab key="incentivized">Incentivized pools</BeetsTab>
                    <BeetsTab key="community">Community pools</BeetsTab>
                    {isConnected ? <BeetsTab key="my-investments">My investments</BeetsTab> : null}
                </HStack>
            </TabList>
        </Tabs>
    );
}
