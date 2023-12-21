import { Box, VStack, Heading, HStack, Divider, Spacer, Button, Text } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { FtmTokenInput } from '~/components/inputs/FtmTokenInput';
import { networkConfig } from '~/lib/config/network-config';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useState } from 'react';
import { useSftmxGetCalculatePenalty } from './useSftmxGetCalculatePenalty';
import { formatFixed } from '@ethersproject/bignumber';
import { SftmxUnstakeButton } from './SftmxUnstakeButton';

export default function SftmxUnstakeTab() {
    const { isConnected } = useUserAccount();
    const { data: stakingData } = useSftmxGetStakingData();
    const [amount, setAmount] = useState('');

    const { data: penaltyData } = useSftmxGetCalculatePenalty(amount);

    return (
        <Card shadow="lg" h="full">
            <VStack spacing="4" p={{ base: '4', lg: '8' }} align="flex-start" h="full">
                <Heading size="md">Enter amount to unstake</Heading>
                <FtmTokenInput
                    address={networkConfig.sftmx.address}
                    label="Unstake"
                    value={amount}
                    onChange={setAmount}
                />
                <HStack w="full" justifyContent="space-between">
                    <Text>You will get</Text>
                    <Text>
                        {`${
                            amount && stakingData
                                ? tokenFormatAmount(
                                      parseFloat(amount) * parseFloat(stakingData.sftmxGetStakingData.exchangeRate),
                                  )
                                : '0'
                        } FTM`}
                    </Text>
                </HStack>
                <Divider w="full" />
                <HStack w="full" justifyContent="space-between">
                    <Text>1 sFTMX is</Text>
                    <Text>{tokenFormatAmount(stakingData?.sftmxGetStakingData.exchangeRate || '0')} FTM</Text>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                    <Text>Penalty</Text>
                    <Text>{penaltyData ? formatFixed(penaltyData.amountPenalty, 18) : '-'}%</Text>
                </HStack>
                <Spacer />
                <Box w="full">
                    {!isConnected && <WalletConnectButton width="full" size="lg" />}
                    {isConnected && <SftmxUnstakeButton amount={amount} penalty={penaltyData?.amountPenalty} />}
                </Box>
            </VStack>
        </Card>
    );
}
