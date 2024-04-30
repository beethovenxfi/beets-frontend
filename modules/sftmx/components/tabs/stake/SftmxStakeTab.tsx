import { Box, VStack, HStack, Divider, Spacer, Text, Alert } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { FtmTokenInput } from '~/components/inputs/FtmTokenInput';
import { networkConfig } from '~/lib/config/network-config';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetStakingData } from '../../../lib/useSftmxGetStakingData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useEffect, useState } from 'react';
import { SftmxStakeButton } from './SftmxStakeButton';
import { useSftmxGetFtmxAmountForFtm } from '../../../lib/useSftmxGetFtmxAmountForFtm';
import { formatFixed } from '@ethersproject/bignumber';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';

export default function SftmxStakeTab() {
    const [amount, setAmount] = useState('');
    const [sftmxAmount, setSftmxAmount] = useState('');
    const { isConnected } = useUserAccount();
    const { data: sftmxStakingData } = useSftmxGetStakingData();
    const { data: sftmxAmountData, isLoading: isLoadingSftmxAmountData } = useSftmxGetFtmxAmountForFtm('1'); // set to 1 FTM to get current rate
    const { refetch } = useUserTokenBalances();

    useEffect(() => {
        if (!isLoadingSftmxAmountData && sftmxAmountData) {
            setSftmxAmount(formatFixed(sftmxAmountData.amountSftmx, 18));
        }
    }, [isLoadingSftmxAmountData, sftmxAmountData]);

    const exchangeRateFtm = parseFloat(sftmxAmount);

    const isBelowMin =
        sftmxStakingData && parseFloat(amount) < parseFloat(sftmxStakingData.sftmxGetStakingData.minDepositLimit);
    const isAboveMax =
        sftmxStakingData && parseFloat(amount) > parseFloat(sftmxStakingData.sftmxGetStakingData.maxDepositLimit);

    return (
        <Card shadow="lg" h="full" title="Enter amount to stake">
            <VStack spacing="4" p="4" align="flex-start" h="full">
                <FtmTokenInput
                    address={networkConfig.eth.address}
                    label="Stake"
                    value={amount}
                    onChange={setAmount}
                    leaveSomeGas
                />
                {isBelowMin && <Alert status="error">Amount below minimum deposit requirement.</Alert>}
                {isAboveMax && <Alert status="error">Amount above maximum deposit requirement.</Alert>}
                <HStack w="full" justifyContent="space-between">
                    <Text>You will get</Text>
                    <Text>{`${
                        amount && !isLoadingSftmxAmountData && !isBelowMin && !isAboveMax
                            ? tokenFormatAmount(parseFloat(amount) * exchangeRateFtm)
                            : '--'
                    } sFTMx`}</Text>
                </HStack>
                <Divider />
                <HStack w="full" justifyContent="space-between">
                    <Text>1 FTM is</Text>
                    <Text>{isLoadingSftmxAmountData ? '-' : tokenFormatAmount(exchangeRateFtm)} sFTMx</Text>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                    <Text>1 sFTMx is</Text>
                    <Text>{isLoadingSftmxAmountData ? '-' : tokenFormatAmount(1 / exchangeRateFtm)} FTM</Text>
                </HStack>
                <Spacer />
                <Box w="full">
                    {!isConnected && <WalletConnectButton width="full" size="lg" />}
                    {isConnected && (
                        <SftmxStakeButton
                            amount={amount}
                            isDisabled={!amount || isBelowMin || isAboveMax}
                            onConfirmed={() => {
                                setAmount('');
                                refetch();
                            }}
                        />
                    )}
                </Box>
            </VStack>
        </Card>
    );
}
