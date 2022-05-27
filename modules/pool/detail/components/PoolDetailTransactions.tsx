import { usePool } from '~/modules/pool/lib/usePool';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps } from '@chakra-ui/layout';
import { PoolDetailSwaps } from '~/modules/pool/detail/components/PoolDetailSwaps';
import { PoolDetailInvestments } from '~/modules/pool/detail/components/PoolDetailInvestments';

export function PoolDetailTransactions(props: BoxProps) {
    return (
        <Box {...props}>
            <Tabs>
                <TabList>
                    <Tab fontSize="xl" fontWeight="bold">
                        Investments
                    </Tab>
                    <Tab fontSize="xl" fontWeight="bold">
                        Swaps
                    </Tab>
                    <Tab fontSize="xl" fontWeight="bold">
                        My investments
                    </Tab>
                </TabList>

                <BeetsBox mt={4}>
                    <TabPanels>
                        <TabPanel p={0} m={0}>
                            <PoolDetailInvestments />
                        </TabPanel>
                        <TabPanel p={0} m={0}>
                            <PoolDetailSwaps />
                        </TabPanel>
                        <TabPanel>
                            <p>My investments</p>
                        </TabPanel>
                    </TabPanels>
                </BeetsBox>
            </Tabs>
        </Box>
    );
}
