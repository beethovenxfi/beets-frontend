import { VStack, HStack, Divider, Text, Heading, Box, Link, StackDivider } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import { networkConfig } from '~/lib/config/network-config';
import { ExternalLink } from 'react-feather';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';

function TokenInfo({ amount }: { amount: string }) {
    const { formattedPrice, getToken } = useGetTokens();
    const token = getToken(networkConfig.eth.address);

    return (
        token && (
            <HStack justifyContent="space-between" width="full">
                <HStack>
                    <TokenAvatar width="40px" height="40px" maxWidth="40px" maxHeight="40px" address={token.address} />
                    <VStack spacing="0" align="flex-start">
                        <Text>{token.name}</Text>
                        <Text fontWeight="bold">{token?.symbol}</Text>
                    </VStack>
                </HStack>
                <VStack alignItems="flex-end" spacing="0">
                    <Text>{tokenFormatAmountPrecise(amount, 1)}</Text>
                    <Text fontSize="sm" color="beets.base.100">
                        ~
                        {formattedPrice({
                            address: token.address,
                            amount,
                        })}
                    </Text>
                </VStack>
            </HStack>
        )
    );
}

export default function SftmxOverallStats() {
    const { data } = useSftmxGetStakingData();

    return (
        <VStack align="flex-start" h="full">
            <Box h="56px"></Box>
            <Card p="4" h="full" w="full">
                <VStack spacing="4" w="full" align="flex-start">
                    <VStack spacing="2" align="flex-start">
                        <Heading size="sm">Staking APR</Heading>
                        <HStack>
                            <div className="apr-stripes">
                                {numeral(data?.sftmxGetStakingData.stakingApr || '').format('0.00%')}
                            </div>
                        </HStack>
                    </VStack>
                    <Divider />
                    <VStack w="full" align="flex-start" divider={<StackDivider borderColor="whiteAlpha.200" />} gap="2">
                        <VStack w="full" align="flex-start">
                            <Heading size="sm" mb="2">
                                Total staked
                            </Heading>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmountStaked} />}
                        </VStack>
                        <VStack w="full" align="flex-start">
                            <Heading size="sm" mb="2">
                                Total free
                            </Heading>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmountInPool} />}
                        </VStack>
                        <VStack w="full" align="flex-start">
                            <Heading size="sm" mb="2">
                                Total
                            </Heading>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmount} />}
                        </VStack>
                    </VStack>
                </VStack>
            </Card>
        </VStack>
    );
}
