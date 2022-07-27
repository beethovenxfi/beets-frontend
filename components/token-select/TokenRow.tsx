import { Button, ButtonProps } from '@chakra-ui/button';
import { Box, Heading, HStack, Text } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { Circle, Skeleton } from '@chakra-ui/react';

type TokenRowProps = TokenBase & {
    userBalance: AmountHumanReadable;
    userBalanceUSD: number;
    loading: boolean;
};

export function TokenRow({
    symbol,
    address,
    onClick,
    userBalance,
    userBalanceUSD,
    loading,
}: TokenRowProps & ButtonProps) {
    const hasBalance = parseFloat(userBalance) > 0;

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
            <HStack width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} size="xs" />
                    <Text fontSize="lg">{symbol}</Text>
                </HStack>
                <Box marginTop="2px" display="flex" flexDirection="column">
                    {loading ? (
                        <>
                            <Skeleton width="12" height="3" mb="1" />
                            <Skeleton width="12" height="3" />
                        </>
                    ) : (
                        <>
                            <Text textAlign="right">{hasBalance ? tokenFormatAmountPrecise(userBalance, 4) : '-'}</Text>
                            <Text color="gray.200" textAlign="right" fontSize="sm">
                                {userBalanceUSD > 0 ? numberFormatUSDValue(userBalanceUSD) : '-'}
                            </Text>
                        </>
                    )}
                </Box>
            </HStack>
        </Button>
    );
}
