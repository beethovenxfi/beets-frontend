import { VStack, HStack, Divider, Text, Heading, Box } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import { networkConfig } from '~/lib/config/network-config';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export default function SftmxOverallStats() {
    const { data } = useSftmxGetStakingData();
    const { priceForAmount } = useGetTokens();
    const address = networkConfig.eth.address;

    const totalFtmAmount = data?.sftmxGetStakingData.totalFtmAmount;
    const totalFtmAmountUsd = priceForAmount({ address, amount: totalFtmAmount || '' });
    const totalFtmAmountStaked = data?.sftmxGetStakingData.totalFtmAmountStaked;
    const totalFtmAmountStakedUsd = priceForAmount({ address, amount: totalFtmAmountStaked || '' });
    const totalFtmAmountInPool = data?.sftmxGetStakingData.totalFtmAmountInPool;
    const totalFtmAmountInPoolUsd = priceForAmount({ address, amount: totalFtmAmountInPool || '' });

    return (
        <VStack align="flex-start" h="full">
            <Box h="56px">
                <Heading>Stats</Heading>
            </Box>
            <Card p={{ base: '4', lg: '8' }} h="full" w="full">
                <VStack spacing="8" w="full" align="flex-start">
                    <Card w="full" p="4">
                        <VStack w="full" align="flex-start">
                            <Heading size="sm">Staking</Heading>
                            <HStack w="full" justifyContent="space-between">
                                <Box>APR</Box>
                                <Text color="white">
                                    {numeral(data?.sftmxGetStakingData.stakingApr || '').format('0.00%')}
                                </Text>
                            </HStack>
                        </VStack>
                    </Card>
                    <Card w="full" p="4">
                        <VStack w="full" align="flex-start">
                            <Heading size="sm">FTM</Heading>
                            <HStack w="full" justifyContent="space-between">
                                <Box>Total amount</Box>
                                <VStack spacing="0" align="flex-end">
                                    <Text color="white">
                                        {numeral(totalFtmAmount || '').format('0,0.00a')}
                                        <Text as="span">&nbsp;FTM </Text>
                                    </Text>
                                    <Text fontSize="sm" color="gray.200">
                                        ({numberFormatUSDValue(totalFtmAmountUsd)})
                                    </Text>
                                </VStack>
                            </HStack>
                            <Divider my="2" />
                            <HStack w="full" justifyContent="space-between">
                                <Box>Total amount staked</Box>
                                <VStack spacing="0" align="flex-end">
                                    <Text color="white">
                                        {numeral(data?.sftmxGetStakingData.totalFtmAmountStaked).format('0,0.00a')}
                                        <Text as="span">&nbsp;FTM</Text>
                                    </Text>
                                    <Text fontSize="sm" color="gray.200">
                                        ({numberFormatUSDValue(totalFtmAmountStakedUsd)})
                                    </Text>
                                </VStack>
                            </HStack>
                            <Divider my="2" />
                            <HStack w="full" justifyContent="space-between">
                                <Box>Total amount free</Box>
                                <VStack spacing="0" align="flex-end">
                                    <Text color="white">
                                        {numeral(data?.sftmxGetStakingData.totalFtmAmountInPool).format('0,0.00a')}
                                        <Text as="span">&nbsp;FTM</Text>
                                    </Text>
                                    <Text fontSize="sm" color="gray.200">
                                        ({numberFormatUSDValue(totalFtmAmountInPoolUsd)})
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </Card>
                </VStack>
            </Card>
        </VStack>
    );
}
