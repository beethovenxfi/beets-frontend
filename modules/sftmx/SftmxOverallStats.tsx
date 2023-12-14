import { VStack, HStack, Divider, Text, Heading, Box } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';
import numeral from 'numeral';

export default function SftmxOverallStats() {
    const { data } = useSftmxGetStakingData();

    return (
        <VStack align="flex-start">
            <Box h="56px">
                <Heading>Stats</Heading>
            </Box>
            <Card p={{ base: '4', lg: '8' }} h="full" w="full">
                <VStack spacing="4" w="full" align="flex-start">
                    <VStack spacing="0" align="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Staking APR
                        </Text>
                        <HStack>
                            <div className="apr-stripes">
                                {numeral(data?.sftmxGetStakingData.stakingApr || '').format('0.00%')}
                            </div>
                        </HStack>
                    </VStack>
                    <Divider />
                    <VStack spacing="4" align="flex-start">
                        <VStack w="full" align="flex-start" spacing="0">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Total amount
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numeral(data?.sftmxGetStakingData.totalAmount).format('0,0.00a')}
                                <Text as="span" fontSize="xl">
                                    &nbsp;FTM
                                </Text>
                            </Text>
                        </VStack>
                        <VStack w="full" align="flex-start" spacing="0">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Total amount staked
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numeral(data?.sftmxGetStakingData.totalAmountStaked).format('0,0.00a')}
                                <Text as="span" fontSize="xl">
                                    &nbsp;FTM
                                </Text>
                            </Text>
                        </VStack>
                        <VStack w="full" align="flex-start" spacing="0">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Total amount free
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numeral(data?.sftmxGetStakingData.totalAmountInPool).format('0,0.00a')}
                                <Text as="span" fontSize="xl">
                                    &nbsp;FTM
                                </Text>
                            </Text>
                        </VStack>
                    </VStack>
                </VStack>
            </Card>
        </VStack>
    );
}
