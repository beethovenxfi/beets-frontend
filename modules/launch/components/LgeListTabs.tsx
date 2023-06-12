import { Box, HStack, TabList, Tabs } from '@chakra-ui/react';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useLgeList } from '../useLgeList';

export function LgeListTabs() {
    const { lges } = useLgeList();
    const TABS = [{ id: 'active' }, { id: 'inactive' }];

    const handleTabChanged = (index: number) => {
        const tab = TABS[index];

        if (['incentivized', 'community'].includes(tab.id)) {
            // setShowMyInvestments(false);
            // refreshLgeList({
            //     ...state,
            //     skip: 0,
            //     first: 20,
            //     where: {
            //         ...state.where,
            //         categoryIn,
            //         categoryNotIn,
            //         idIn: undefined,
            //     },
            // });
        } else {
            // if (!showMyInvestments) {
            //     setShowMyInvestments(true);
            // }
        }
    };

    return (
        <Tabs variant="soft-rounded" display="flex" onChange={handleTabChanged} defaultIndex={0}>
            <TabList>
                <HStack spacing="2">
                    <BeetsTab key="active">Active & Upcoming</BeetsTab>
                    <BeetsTab key="inactive">Previous</BeetsTab>
                </HStack>
            </TabList>
        </Tabs>
    );
}
