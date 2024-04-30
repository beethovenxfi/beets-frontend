import { VStack, HStack, Divider, Text, Heading, Box, StackDivider, Spacer, Link } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import { networkConfig } from '~/lib/config/network-config';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { InfoButton } from '~/components/info-button/InfoButton';
import { ExternalLink } from 'react-feather';

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
                    <Text>{tokenFormatAmount(amount)}</Text>
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
        <VStack align="flex-start" w="full" h="full">
            <Box h="50px" display={{ base: 'none', lg: 'block' }}></Box>
            <Card p="4" w="full" h="full">
                <VStack spacing="4" w="full" h="full" align="flex-start">
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
                                Total
                            </Heading>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmount} />}
                        </VStack>
                        <VStack w="full" align="flex-start">
                            <Heading size="sm" mb="2">
                                Total staked
                            </Heading>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmountStaked} />}
                        </VStack>
                        <VStack w="full" align="flex-start">
                            <Box mb="2">
                                <InfoButton
                                    labelProps={{
                                        lineHeight: '1.25rem',
                                        fontWeight: 'bold',
                                        fontSize: 'md',
                                    }}
                                    label="Total free"
                                    infoText="The free pool is a dynamic reserve of to-be-staked FTM that allows penalty-free unstaking. The pool is made up of new staking deposits, maturities, and accrued rewards."
                                />
                            </Box>
                            {data && <TokenInfo amount={data?.sftmxGetStakingData.totalFtmAmountInPool} />}
                        </VStack>
                    </VStack>
                    <Spacer />
                    <HStack>
                        <Text fontSize="sm">Find more info on </Text>
                        <Link href="https://www.defiwars.xyz/wars/ftm" target="_blank">
                            <HStack>
                                <Text fontSize="sm">Defi Wars</Text>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </HStack>
                </VStack>
            </Card>
        </VStack>
    );
}
