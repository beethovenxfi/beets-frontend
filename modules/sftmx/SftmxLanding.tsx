import { Tabs, TabList, TabPanels, TabPanel, Grid, GridItem } from '@chakra-ui/react';
import BeetsTab from '~/components/tabs/BeetsTab';
import SftmxStakeTab from './SftmxStakeTab';
import SftmxUnstakeTab from './SftmxUnstakeTab';
import SftmxOverallStats from './SftmxOverallStats';
import SftmxWithdrawTab from './SftmxWithdrawTab';
import { useSftmxGetWithdrawalRequests } from './lib/useSftmxGetWithdrawalRequests';
import { SftmxStatsVaultsCard } from './components/stats/SftmxStatsVaultsCard';
import { SftmxStatsChartsCard } from './components/stats/SftmxStatsChartsCard';

export default function SftmxLanding() {
    const { startPolling, stopPolling } = useSftmxGetWithdrawalRequests();

    return (
        <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(5, 1fr)' }}
            templateAreas={{
                base: `"tabs" "stats" "charts" "vaults"`,
                xl: `". stats tabs tabs  ." "vaults vaults charts charts charts"`,
            }}
            gap="8"
            w="full"
        >
            <GridItem area="tabs">
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
                        <Grid gap="4" w="full" templateAreas={`"stake unstake withdraw"`}>
                            <GridItem area="stake">
                                <BeetsTab w="full">Stake</BeetsTab>
                            </GridItem>
                            <GridItem area="unstake">
                                <BeetsTab w="full">Unstake</BeetsTab>
                            </GridItem>
                            <GridItem area="withdraw">
                                <BeetsTab w="full">Withdraw</BeetsTab>
                            </GridItem>
                        </Grid>
                    </TabList>
                    <TabPanels>
                        <TabPanel px="0" pb="0">
                            <SftmxStakeTab />
                        </TabPanel>
                        <TabPanel px="0" pb="0">
                            <SftmxUnstakeTab />
                        </TabPanel>
                        <TabPanel px="0" pb="0">
                            <SftmxWithdrawTab />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </GridItem>
            <GridItem area="stats">
                <SftmxOverallStats />
            </GridItem>
            <GridItem area="charts">
                <SftmxStatsChartsCard />
            </GridItem>
            <GridItem area="vaults">
                <SftmxStatsVaultsCard />
            </GridItem>
        </Grid>
    );
}
