import {
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    Button,
    useTheme,
    Text,
    HStack,
    Flex,
    VStack,
    Box,
    useStyleConfig,
    BoxProps,
    MenuItemProps,
} from '@chakra-ui/react';
import React from 'react';
import { Check, ChevronDown } from 'react-feather';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsTooltip from '../tooltip/BeetsTooltip';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { protocolThemeProp } from '~/styles/theme-util';

interface Props {
    tokenOptions: GqlPoolToken[];
    selectedAddress: string;
    onOptionSelect: (address: string) => void;
    minimal?: boolean;
}

export function TokenSelectInline({ tokenOptions, selectedAddress, onOptionSelect, minimal }: Props) {
    const theme = useTheme();
    const { protocol } = useNetworkConfig();
    const selectedToken = tokenOptions.find((option) => option.address === selectedAddress);

    const menuListStyles = useStyleConfig('MenuList', { variant: protocol }) as BoxProps;
    const menuItemStyles = useStyleConfig('MenuListItem', { variant: protocol }) as MenuItemProps;

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <BeetsTooltip label="You can choose to use another, equivalent variant of this token.">
                        <MenuButton
                            isActive={isOpen}
                            as={Button}
                            rightIcon={
                                <Flex
                                    backgroundColor="whiteAlpha.200"
                                    rounded="full"
                                    alignItems="center"
                                    justifyContent="center"
                                    p="1"
                                >
                                    <ChevronDown color={theme.colors.beets.green} />
                                </Flex>
                            }
                            variant={protocol === 'balancer' ? '' : 'ghost'}
                            px="1.5"
                            minHeight="50px"
                        >
                            {minimal && (
                                <HStack spacing="1.5" flex="1">
                                    <TokenAvatar size="xs" address={selectedAddress} />
                                    <Text>{selectedToken?.symbol}</Text>
                                </HStack>
                            )}
                            {!minimal && (
                                <HStack>
                                    <TokenAvatar width="40px" height="40px" address={selectedAddress} />
                                    <VStack spacing="1" alignItems="flex-start">
                                        <Text fontWeight="normal">{selectedToken?.name}</Text>
                                        <HStack spacing="1">
                                            <Text fontWeight="bold">{selectedToken?.symbol}</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            )}
                        </MenuButton>
                    </BeetsTooltip>
                    <MenuList {...menuListStyles} p="0">
                        <Box
                            py="1"
                            px="1"
                            backgroundColor={protocolThemeProp({
                                balancer: 'white',
                                beets: 'blackAlpha.400',
                            })}
                        >
                            <Box backgroundColor="bg">
                                <Box
                                    backgroundColor={protocolThemeProp({
                                        balancer: 'white',
                                        beets: 'blackAlpha.800',
                                    })}
                                >
                                    {tokenOptions.map((option) => (
                                        <MenuItem
                                            {...menuItemStyles}
                                            key={option.address}
                                            display="flex"
                                            onClick={() => onOptionSelect(option.address)}
                                        >
                                            <HStack spacing="1.5" flex="1">
                                                <TokenAvatar width="20px" height="20px" address={option.address} />
                                                <Text color="inline" fontWeight="normal">
                                                    {option.symbol}
                                                </Text>
                                            </HStack>
                                            {option.address === selectedAddress ? <Check /> : null}
                                        </MenuItem>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </MenuList>
                </>
            )}
        </Menu>
    );
}
