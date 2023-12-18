import { Box, VStack, Heading, HStack, Divider, Spacer, Text, Alert } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { FtmTokenInput } from '~/components/inputs/FtmTokenInput';
import { networkConfig } from '~/lib/config/network-config';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useState } from 'react';
import { SftmxStakeButton } from './SftmxStakeButton';

export default function SftmxStakeTab() {
    const { isConnected } = useUserAccount();
    const { data } = useSftmxGetStakingData();
    const [amount, setAmount] = useState('');

    const exchangeRateFtm = 1 / parseFloat(data?.sftmxGetStakingData.exchangeRate || '');

    return (
        <Card shadow="lg" h="full">
            <VStack spacing="4" p={{ base: '4', lg: '8' }} align="flex-start" h="full">
                <Heading size="md">Enter amount to stake</Heading>
                <FtmTokenInput address={networkConfig.eth.address} label="Stake" value={amount} onChange={setAmount} />
                {data && parseFloat(amount) < parseFloat(data.sftmxGetStakingData.minDepositLimit) && (
                    <Alert status="error">Amount below minimum deposit requirement.</Alert>
                )}
                {data && parseFloat(amount) > parseFloat(data.sftmxGetStakingData.maxDepositLimit) && (
                    <Alert status="error">Amount above maximum deposit requirement.</Alert>
                )}
                <HStack w="full" justifyContent="space-between">
                    <Text>You will get</Text>
                    <Text>{`${amount ? tokenFormatAmount(parseFloat(amount) * exchangeRateFtm) : '0'} SFTMX`}</Text>
                </HStack>
                <Divider />
                <HStack w="full" justifyContent="space-between">
                    <Text>1 FTM is</Text>
                    <Text>{tokenFormatAmount(exchangeRateFtm)} sFTMX</Text>
                </HStack>
                <Spacer />
                <Box w="full">
                    {!isConnected && <WalletConnectButton width="full" size="lg" />}
                    {isConnected && <SftmxStakeButton amount={amount} />}
                </Box>
            </VStack>
        </Card>
    );
}
