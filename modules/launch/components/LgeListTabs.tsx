import { HStack, TabList, Tabs } from '@chakra-ui/react';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useLgeList } from '~/modules/launch/useLgeList';

export function LgeListTabs() {
    const { setFilter } = useLgeList();
    const TABS = [{ id: 'active-upcoming' }, { id: 'ended' }];

    const handleTabChanged = (index: number) => {
        setFilter(TABS[index].id);
    };

    return (
        <Tabs variant="soft-rounded" display="flex" onChange={handleTabChanged} defaultIndex={0}>
            <TabList>
                <HStack spacing="2">
                    <BeetsTab key="active-upcoming">Active & Upcoming</BeetsTab>
                    <BeetsTab key="ended">Ended</BeetsTab>
                </HStack>
            </TabList>
        </Tabs>
    );
}