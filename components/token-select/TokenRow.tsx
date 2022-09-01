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
    userBalance: AmountHumanReadable;
    userBalanceUSD: number;
    loading: boolean;
    imported?: boolean;
};

export function TokenRow({
    symbol,
    address,
    onClick,
    userBalance,
    userBalanceUSD,
    loading,
    imported,
}: TokenRowProps & ButtonProps) {
    const hasBalance = parseFloat(userBalance) > 0;
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
            <HStack px="3" width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} size="xs" />
                    <Text fontSize="lg">{symbol}</Text>
                    {imported && (
                        <Badge colorScheme="orange" py="0.5">
                            Imported
                        </Badge>
                    )}
                    {!isEth(address) && (
                        <PlusCircle
                            onClick={(e) => {
                                e.stopPropagation();
                                addTokenToWallet(token);
                            }}
                            size={16}
                            color={theme.colors.gray['200']}
                        />
                    )}
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
