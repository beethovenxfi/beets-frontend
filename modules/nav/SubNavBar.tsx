import { Box, HStack, Image, Skeleton, Text } from '@chakra-ui/react';
import { useGetProtocolDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { ChevronDown } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';
import { SubNavBarStat } from '~/modules/nav/SubNavBarStat';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { NetworkSelectorPopover } from '~/modules/nav/NetworkSelectorPopover';

export function SubNavBar() {
    const networkConfig = useNetworkConfig();
    const { data, loading } = useGetProtocolDataQuery({ fetchPolicy: 'cache-first' });
    const protocolData = data?.protocolData;
    const protocolTokenPrice = data?.protocolTokenPrice;

    return (
        <HStack px={{ base: '4', xl: '8' }}>
            <BeetsBox px="4" py="2" rounded="lg" display="flex">
                <NetworkSelectorPopover>
                    <HStack spacing="1.5" mr={6} cursor="pointer">
                        <Image src={networkConfig.eth.iconUrl} width="20px" height="20px" />
                        <Text fontWeight="bold">{networkConfig.networkShortName}</Text>
                        <Box top="1px" position="relative">
                            <ChevronDown size={18} />
                        </Box>
                    </HStack>
                </NetworkSelectorPopover>

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
                    mr={networkConfig.featureFlags.protocolTokenPrice ? 5 : 0}
                />
                {networkConfig.featureFlags.protocolTokenPrice && (
                    <HStack>
                        <TokenAvatar
                            address={networkConfig.protocolTokenAddress}
                            style={{ width: '20px', height: '20px' }}
                        />
                        {loading && !protocolTokenPrice ? (
                            <Skeleton height="16px" width="54px" />
                        ) : (
                            <Text fontWeight="semibold" fontSize={{ base: 'sm', lg: 'md' }}>
                                {numeral(protocolTokenPrice).format('$0.00[00]')}
                            </Text>
                        )}
                    </HStack>
                )}
            </BeetsBox>
        </HStack>
    );
}
