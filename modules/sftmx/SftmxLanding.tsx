import { Tabs, TabList, TabPanels, TabPanel, Grid, GridItem } from '@chakra-ui/react';
import BeetsTab from '~/components/tabs/BeetsTab';
import SftmxStakeTab from './components/tabs/stake/SftmxStakeTab';
import SftmxUnstakeTab from './components/tabs/unstake/SftmxUnstakeTab';
import SftmxOverallStats from './components/stats/SftmxOverallStats';
import SftmxWithdrawTab from './components/tabs/withdraw/SftmxWithdrawTab';
import { useSftmxGetWithdrawalRequests } from './lib/useSftmxGetWithdrawalRequests';
import { SftmxStatsFtmStakedFree } from './components/stats/SftmxStatsFtmStakedFree';
import { SftmxStatsFtmValidator } from './components/stats/SftmxStatsFtmValidator';
import { SftmxStatsVaults } from './components/stats/SftmxStatsVaults';

export default function SftmxLanding() {
    const { startPolling, stopPolling } = useSftmxGetWithdrawalRequests();

    return (
        <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(5, 1fr)' }}
            templateAreas={{
                base: `"tabs" "stats" "charts" "pie" "table"`,
                xl: `". tabs tabs stats ." "charts charts charts charts charts" "pie pie table table table"`,
            }}
            gap="8"
            w="full"
            templateRows={{ base: 'auto', lg: 'repeat(3, 640px)' }}
        >
            <GridItem area="tabs" h="full">
                <Tabs
                    variant="soft-rounded"
                    display="flex"
                    flexDirection="column"
                    isLazy
                    onChange={(index: number) => {
                        // start polling for withdrawal requests when Withdraw tab is active, else stop polling again
                        if (index === 2) {
                            startPolling(30000);
                        } else {
                            stopPolling();
                        }
                    }}
                    h="full"
                >
                    <TabList>
                        <Grid gap="4" w="full" templateAreas={`"unstake withdraw"`}>
                            <GridItem area="unstake">
                                <BeetsTab w="full">Unstake</BeetsTab>
                            </GridItem>
                            <GridItem area="withdraw">
                                <BeetsTab w="full">Withdraw</BeetsTab>
                            </GridItem>
                        </Grid>
                    </TabList>
                    <TabPanels h="full">
                        <TabPanel h="full" px="0" pb="0">
                            <SftmxUnstakeTab />
                        </TabPanel>
                        <TabPanel h="full" px="0" pb="0">
                            <SftmxWithdrawTab />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </GridItem>
            <GridItem area="stats">
                <SftmxOverallStats />
            </GridItem>
            <GridItem area="charts">
                <SftmxStatsFtmStakedFree />
            </GridItem>
            <GridItem area="table">
                <SftmxStatsVaults />
            </GridItem>
            <GridItem area="pie">
                <SftmxStatsFtmValidator />
            </GridItem>
        </Grid>
    );
}
