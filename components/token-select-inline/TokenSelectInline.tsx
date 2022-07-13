import { Menu, MenuItem, MenuList, MenuButton, Button, useTheme, Text, HStack, Flex } from '@chakra-ui/react';
import { Check, ChevronDown } from 'react-feather';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import TokenAvatar from '~/components/token/TokenAvatar';

interface Props {
    tokenOptions: GqlPoolToken[];
    selectedAddress: string;
    onOptionSelect: (address: string) => void;
}

export function TokenSelectInline({ tokenOptions, selectedAddress, onOptionSelect }: Props) {
    const theme = useTheme();
    const selectedToken = tokenOptions.find((option) => option.address === selectedAddress);

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<ChevronDown color={theme.colors.beets.green} />}
                        variant="ghost"
                        px="1.5"
                    >
                        <HStack spacing="1.5" flex="1">
                            <TokenAvatar width="20px" height="20px" address={selectedAddress} />
                            <Text color="gray.100" fontWeight="normal">
                                {selectedToken?.symbol}
                            </Text>
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        {tokenOptions.map((option) => (
                            <MenuItem
                                key={option.address}
                                display="flex"
                                onClick={() => onOptionSelect(option.address)}
                            >
                                <HStack spacing="1.5" flex="1">
                                    <TokenAvatar width="20px" height="20px" address={option.address} />
                                    <Text color="gray.100" fontWeight="normal">
                                        {option.symbol}
                                    </Text>
                                </HStack>
                                {option.address === selectedAddress ? <Check /> : null}
                            </MenuItem>
                        ))}
                    </MenuList>
                </>
            )}
        </Menu>
    );
}
