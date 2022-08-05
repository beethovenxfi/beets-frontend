import { Box, HStack, Link, Popover, PopoverContent, PopoverTrigger, Skeleton, Text } from '@chakra-ui/react';
import { useGetProtocolDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import Image from 'next/image';
import { Check, ChevronDown } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import OptimismLogo from '~/assets/images/optimism.svg';
import FantomLogo from '~/assets/images/fantom-logo.png';
import numeral from 'numeral';
import { SubNavBarStat } from '~/modules/nav/SubNavBarStat';
import { useGetTokens } from '~/lib/global/useToken';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function SubNavBar() {
    const networkConfig = useNetworkConfig();
    const { chainId } = useNetworkConfig();
    const { priceFor } = useGetTokens();
    const { data, error, loading } = useGetProtocolDataQuery({ fetchPolicy: 'cache-first' });
    const protocolData = data?.protocolData;

    return (
        <HStack px={{ base: '4', xl: '8' }}>
            <BeetsBox px="4" py="2" rounded="lg" display="flex">
                <Popover trigger="hover" placement="bottom-start">
                    {/*
                    // @ts-ignore */}
                    <PopoverTrigger>
                        <HStack spacing="1" mr={6} cursor="pointer">
                            <Image src={chainId === '10' ? OptimismLogo : FantomLogo} width="20" height="20" />
                            <Text fontWeight="bold">{chainId === '10' ? 'Optimism' : 'Fantom'}</Text>
                            <Box top="1px" position="relative">
                                <ChevronDown size={18} />
                            </Box>
                        </HStack>
                    </PopoverTrigger>

                    <PopoverContent w="fit-content" bg="black">
                        <BeetsBox bg="beets.base.900">
                            <Box px="4" py="2" fontWeight="bold" borderBottomWidth={1} borderBottomColor="gray.400">
                                Select a network
                            </Box>
                            <Box>
                                <Link href="https://v2.beets.fi" color="white">
                                    <HStack spacing="2" pl="4" pb="2" pt="4" pr="2">
                                        <Image src={FantomLogo} width="20" height="20" />
                                        <Text flex="1" pr="2">
                                            Fantom
                                        </Text>
                                        {chainId === '250' && <Check />}
                                    </HStack>
                                </Link>
                                <Link href="https://opv2.beets.fi" color="white">
                                    <HStack spacing="2" pl="4" pt="2" pb="4" pr="2">
                                        <Image src={OptimismLogo} width="20" height="20" />
                                        <Text flex="1" pr="2">
                                            Optimism
                                        </Text>
                                        {chainId === '10' && <Check />}
                                    </HStack>
                                </Link>
                            </Box>
                        </BeetsBox>
                    </PopoverContent>
                </Popover>
                <SubNavBarStat
                    loading={loading && !protocolData}
                    value={protocolData?.totalLiquidity || '0'}
                    label="TVL"
                    display={{ base: 'none', sm: 'flex' }}
                />
                <SubNavBarStat
                    loading={loading && !protocolData}
                    value={protocolData?.swapVolume24h || '0'}
                    label="Volume (24h)"
                    display={{ base: 'none', lg: 'flex' }}
                />
                <SubNavBarStat
                    loading={loading && !protocolData}
                    value={protocolData?.swapFee24h || '0'}
                    label="Fees (24h)"
                    display={{ base: 'none', lg: 'flex' }}
                />
                <HStack>
                    <TokenAvatar address={networkConfig.beets.address} style={{ width: '20px', height: '20px' }} />
                    {loading && !protocolData ? (
                        <Skeleton height="16px" width="54px" />
                    ) : (
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', lg: 'md' }}>
                            {numeral(priceFor(networkConfig.beets.address)).format('$0.00[00]')}
                        </Text>
                    )}
                </HStack>
            </BeetsBox>
        </HStack>
    );
}
