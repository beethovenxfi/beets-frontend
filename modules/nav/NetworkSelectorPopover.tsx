import { Box, HStack, Link, Popover, PopoverContent, PopoverTrigger, Text, Image } from '@chakra-ui/react';
import { Check } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { networkList } from '~/lib/config/network-config';

interface Props {
    children: any;
}

export function NetworkSelectorPopover({ children }: Props) {
    const { chainId, protocol } = useNetworkConfig();

    return (
        <Popover trigger="hover" placement="bottom-start">
            {/*
            // @ts-ignore */}
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent w="fit-content" bg={protocol === 'balancer' ? 'white' : "black"}>
                <BeetsBox
                    bg={protocol === 'balancer' ? 'white' : 'beets.base.900'}
                    shadow={protocol === 'balancer' ? 'dark-lg' : 'none'}
                >
                    <Box
                        px="4"
                        py="2"
                        fontWeight="bold"
                        borderBottomWidth={1}
                        bg={protocol === 'balancer' ? 'blackAlpha.200   ' : ''}
                        borderBottomColor={protocol === 'balancer' ? 'white' : 'gray.400'}
                    >
                        Select a network
                    </Box>
                    <Box>
                        {networkList.map((network) => (
                            <Link key={network.chainId} href={network.url} color={protocol === 'balancer' ? 'beets.gray' : "white"}>
                                <HStack spacing="2" pl="4" pb="2" pt="4" pr="2">
                                    <Image src={network.iconUrl} width="20px" height="20px" />
                                    <Text flex="1" pr="2">
                                        {network.name}
                                    </Text>
                                    {chainId === network.chainId && <Check />}
                                </HStack>
                            </Link>
                        ))}
                    </Box>
                </BeetsBox>
            </PopoverContent>
        </Popover>
    );
}
