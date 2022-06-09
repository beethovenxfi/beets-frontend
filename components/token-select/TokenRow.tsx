import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { memo } from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';
import { motion } from 'framer-motion';
import { Box, Heading, HStack, Text } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { Skeleton } from '@chakra-ui/react';

type TokenRowProps = GqlToken & {
    index: number;
    userBalance: AmountHumanReadable;
    userBalanceUSD: number;
    loading: boolean;
};

export const TokenRow = memo(function TokenRow({
    symbol,
    address,
    index,
    onClick,
    userBalance,
    userBalanceUSD,
    loading,
}: TokenRowProps & ButtonProps) {
    const hasBalance = parseFloat(userBalance) > 0;

    return (
        <Button
            animate={{ opacity: 1, transition: { delay: index * 0.01 } }}
            initial={{ opacity: 0 }}
            as={motion.button}
            width="full"
            height="fit-content"
            variant="ghost"
            _hover={{ backgroundColor: 'blackAlpha.400' }}
            onClick={onClick}
        >
            <HStack width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} size="sm" />
                    <Heading size="md" fontWeight="semibold" color="beets.gray.100">
                        {symbol}
                    </Heading>
                </HStack>
                <Box marginTop="2px" display="flex" flexDirection="column">
                    {loading ? (
                        <>
                            <Skeleton width="12" height="3" mb="1" />
                            <Skeleton width="12" height="3" />
                        </>
                    ) : (
                        <>
                            <Text color="beets.gray.100" textAlign="right">
                                {hasBalance ? tokenFormatAmountPrecise(userBalance, 4) : '-'}
                            </Text>
                            <Text color="beets.gray.300" textAlign="right">
                                {userBalanceUSD > 0 ? numberFormatUSDValue(userBalanceUSD) : '-'}
                            </Text>
                        </>
                    )}
                </Box>
            </HStack>
        </Button>
    );
});
