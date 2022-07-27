import { Button, ButtonProps } from '@chakra-ui/button';
import { Box, HStack, Text } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { TokenBase } from '~/lib/services/token/token-types';
import { LinkProps } from '@chakra-ui/react';

type TokenRowProps = TokenBase & {
    index: number;
    action: 'import' | 'remove';
};

export function TokenActionRow({ symbol, address, onClick, action }: TokenRowProps & ButtonProps & LinkProps) {
    return (
        <Box width="full" height="56px" px="4">
            <HStack width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} size="xs" />
                    <Text fontSize="lg">{symbol}</Text>
                </HStack>
                <Box>
                    <Button size="sm" colorScheme="orange" onClick={onClick}>
                        {action === 'import' ? 'Import' : 'Remove'}
                    </Button>
                </Box>
            </HStack>
        </Box>
    );
}
