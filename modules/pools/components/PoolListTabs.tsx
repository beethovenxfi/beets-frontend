import { Box, HStack, TabList, Tabs } from '@chakra-ui/react';
import { DEFAULT_POOL_LIST_QUERY_VARS, usePoolList } from '~/modules/pools/usePoolList';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function PoolListTabs() {
    const { isConnected } = useUserAccount();
    const { state, refetch: refreshPoolList, setShowMyInvestments, showMyInvestments } = usePoolList();
    const TABS = [{ id: 'community' }, { id: 'my-investments' }];

    const handleTabChanged = (index: number) => {
        const tab = TABS[index];
        const tagNotIn: any = [...DEFAULT_POOL_LIST_QUERY_VARS.where!.tagNotIn!].filter(Boolean);
        const tagIn: any = null;

        if (['community'].includes(tab.id)) {
            setShowMyInvestments(false);
            refreshPoolList({
                ...state,
                skip: 0,
                first: 20,
                where: {
                    ...state.where,
                    tagIn,
                    tagNotIn,
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
            defaultIndex={showMyInvestments ? 1 : 0}
        >
            <TabList>
                <HStack spacing="2">
                    <BeetsTab key="community">All pools</BeetsTab>
                    {isConnected ? <BeetsTab key="my-investments">My investments</BeetsTab> : null}
                </HStack>
            </TabList>
        </Tabs>
    );
}
