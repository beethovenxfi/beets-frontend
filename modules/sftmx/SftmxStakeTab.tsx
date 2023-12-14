import { Box, VStack, Heading, HStack, Divider, Spacer, Button, Text } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { FtmTokenInput } from '~/components/inputs/FtmTokenInput';
import { networkConfig } from '~/lib/config/network-config';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

export default function SftmxStakeTab() {
    const { isConnected } = useUserAccount();
    const { data } = useSftmxGetStakingData();

    const exchangeRateFtm = 1 / parseFloat(data?.sftmxGetStakingData.exchangeRate || '');

    return (
        <Card shadow="lg" h="full">
            <VStack spacing="4" p={{ base: '4', lg: '8' }} align="flex-start" h="full">
                <Heading size="md">Enter amount to stake</Heading>
                <FtmTokenInput address={networkConfig.eth.address} label="Stake" />
                <HStack w="full" justifyContent="space-between">
                    <Text>You will get</Text>
                    <Text>0 SFTMX</Text>
                </HStack>
                <Divider />
                <HStack w="full" justifyContent="space-between">
                    <Text>1 FTM is</Text>
                    <Text>{tokenFormatAmount(exchangeRateFtm)} sFTMX</Text>
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
    );
}
