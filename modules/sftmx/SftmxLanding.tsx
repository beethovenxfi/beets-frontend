import {
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    VStack,
    HStack,
    Grid,
    Button,
    Text,
    Divider,
    Heading,
    Box,
    Spacer,
} from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import BeetsTab from '~/components/tabs/BeetsTab';
import { FtmTokenInput } from '~/components/inputs/FtmTokenInput';
import Card from '~/components/card/Card';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import { networkConfig } from '~/lib/config/network-config';

function SftmxLanding() {
    const { isConnected } = useUserAccount();

    return (
        <VStack spacing="4" width="full" align="flex-start">
            <Grid templateColumns="1fr 1fr" gap="32" w="full" minH="550px">
                <Tabs variant="soft-rounded" display="flex" flexDirection="column">
                    <TabList>
                        <Grid templateColumns="1fr 1fr 1fr" gap="4" w="full">
                            <BeetsTab key="stake">Stake</BeetsTab>
                            <BeetsTab key="unstake">Unstake</BeetsTab>
                            <BeetsTab key="withdraw">Withdraw</BeetsTab>
                        </Grid>
                    </TabList>
                    <TabPanels h="full">
                        <TabPanel h="full" pb="0">
                            <Card shadow="lg" h="full">
                                <VStack spacing="4" p="4" align="flex-start" h="full">
                                    <Heading size="md">Enter an FTM amount</Heading>
                                    <FtmTokenInput address={networkConfig.eth.address} />
                                    <HStack w="full" justifyContent="space-between">
                                        <Text>You will get</Text>
                                        <Text>0 SFTMX</Text>
                                    </HStack>
                                    <Divider />
                                    <HStack w="full" justifyContent="space-between">
                                        <Text>Exchange rate</Text>
                                        <Text>1 FTM = 0.90345 sFTMX</Text>
                                    </HStack>
                                    <Spacer />
                                    <Box w="full">
                                        {!isConnected && <WalletConnectButton width="full" size="lg" />}
                                        {isConnected && (
                                            <Button variant="primary" width="full" size="lg">
                                                Stake
                                            </Button>
                                        )}
                                    </Box>
                                </VStack>
                            </Card>
                        </TabPanel>
                        <TabPanel h="full" pb="0">
                            <Card shadow="lg">
                                <VStack spacing="4" p="4" align="flex-start" h="full">
                                    <Heading size="md">Enter a sFTMX amount</Heading>
                                    <FtmTokenInput address={networkConfig.eth.address} />
                                    <HStack w="full" justifyContent="space-between">
                                        <Text>You will get</Text>
                                        <Text>0 FTM</Text>
                                    </HStack>
                                    <Divider w="full" />
                                    <HStack w="full" justifyContent="space-between">
                                        <Text>Exchange rate</Text>
                                        <Text>1 sFTMX = 1.108211 FTM</Text>
                                    </HStack>
                                    <HStack w="full" justifyContent="space-between">
                                        <Text>Penalty</Text>
                                        <Text>0%</Text>
                                    </HStack>
                                    <Card w="full" p="2">
                                        <HStack w="full" justifyContent="space-between">
                                            <Text>Free Pool</Text>
                                            <Text>1.07M sFTMX</Text>
                                        </HStack>
                                    </Card>
                                    <Spacer />
                                    <Box w="full">
                                        {!isConnected && <WalletConnectButton width="full" size="lg" />}
                                        {isConnected && (
                                            <Button variant="primary" width="full" size="lg">
                                                Unstake
                                            </Button>
                                        )}
                                    </Box>
                                </VStack>
                            </Card>
                        </TabPanel>
                        <TabPanel pb="0">
                            <p>three!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <BeetsBox w="full" h="full" p="16" mb="8">
                    Data
                </BeetsBox>
            </Grid>
        </VStack>
    );
}

export default SftmxLanding;
