import { Tabs, TabList, TabPanels, TabPanel, VStack, Grid, Box } from '@chakra-ui/react';
import BeetsTab from '~/components/tabs/BeetsTab';
import SftmxStakeTab from './SftmxStakeTab';
import SftmxUnstakeTab from './SftmxUnstakeTab';
import SftmxOverallStats from './SftmxOverallStats';
import SftmxWithdrawTab from './SftmxWithdrawTab';
import { useSftmxGetWithdrawalRequests } from './lib/useSftmxGetWithdrawalRequests';

export default function SftmxLanding() {
    const { startPolling, stopPolling } = useSftmxGetWithdrawalRequests();

    return (
        <VStack spacing="4" w="full" align="center">
            <Grid
                templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                gap={{ base: '8', lg: '4' }}
                w={{ base: 'full', lg: '75%' }}
                minH="550px"
            >
                <Tabs
                    variant="soft-rounded"
                    display="flex"
                    flexDirection="column"
                    isLazy
                    onChange={(index: number) => {
                        // start polling for withdrawal requests when Withdraw tab is active, else stop polling again
                        if (index === 2) {
                            startPolling(180000);
                        } else {
                            stopPolling();
                        }
                    }}
                >
                    <TabList>
                        <Grid templateColumns="1fr 1fr 1fr" gap="4" w="full">
                            <BeetsTab key="stake">Stake</BeetsTab>
                            <BeetsTab key="unstake">Unstake</BeetsTab>
                            <BeetsTab key="withdraw">Withdraw</BeetsTab>
                        </Grid>
                    </TabList>
                    <TabPanels h="full">
                        <TabPanel h="full" px="0" pb="0">
                            <SftmxStakeTab />
                        </TabPanel>
                        <TabPanel h="full" px="0" pb="0">
                            <SftmxUnstakeTab />
                        </TabPanel>
                        <TabPanel h="full" px="0" pb="0">
                            <SftmxWithdrawTab />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <Box w={{ base: '100%', lg: '66%' }} h="full">
                    <SftmxOverallStats />
                </Box>
            </Grid>
        </VStack>
    );
}
