import { Button, ButtonProps } from '@chakra-ui/button';
import { Box, Heading, HStack, Text } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { isEth, tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { Badge, Circle, Skeleton, useTheme } from '@chakra-ui/react';
import { PlusCircle } from 'react-feather';
import { useGetTokens } from '~/lib/global/useToken';
import { addTokenToWallet } from '~/lib/util/web3';

type TokenRowProps = TokenBase & {
    imported?: boolean;
};

export function PoolCreateTokenRow({ symbol, address, onClick, imported }: TokenRowProps & ButtonProps) {
    const { getToken } = useGetTokens();
    const token = getToken(address);
    const theme = useTheme();

    return (
        <Button
            width="full"
            variant="ghost"
            _hover={{ backgroundColor: 'whiteAlpha.200' }}
            _focus={{ boxShadow: 'none' }}
            borderRadius="none"
            onClick={onClick}
            height="56px"
            fontWeight="normal"
            color="gray.100"
        >
            <HStack px="3" width="full" paddingY="4">
                <TokenAvatar address={address} size="xs" />
                <Text fontSize="lg">{symbol}</Text>
                {imported && (
                    <Badge colorScheme="orange" py="0.5">
                        Imported
                    </Badge>
                )}
            </HStack>
        </Button>
    );
}
