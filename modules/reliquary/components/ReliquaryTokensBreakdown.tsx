import { Box, HStack, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';
import { useRelicDepositBalance } from '../lib/useRelicDepositBalance';
import { CardRow } from '~/components/card/CardRow';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useReliquaryWithdrawState } from '~/modules/reliquary/withdraw/lib/useReliquaryWithdrawState';

interface Props {
    showTotal?: boolean;
}

export default function ReliquaryTokenBreakdown({ showTotal = false }: Props) {
    const { proportionalPercent, selectedWithdrawType } = useReliquaryWithdrawState();
    const { getToken, priceForAmount } = useGetTokens();
    const { data: relicTokenBalances, isLoading } = useRelicDepositBalance();

    const relicTokenBalancesWithSymbol = relicTokenBalances?.map((token) => ({
        ...token,
        symbol: getToken(token.address)?.symbol,
    }));

    const getAmount = (amount: string) =>
        selectedWithdrawType === 'PROPORTIONAL' && !showTotal
            ? ((proportionalPercent / 100) * parseFloat(amount)).toString()
            : amount;

    return (
        <Box>
            {relicTokenBalancesWithSymbol?.map((balance, index) => (
                <CardRow
                    key={index}
                    mb={index === relicTokenBalancesWithSymbol.length - 1 ? '0' : '1'}
                    alignItems="center"
                    //pl={hasOptions ? '1' : '2'}
                >
                    <Box flex="1">
                        <HStack spacing="1.5">
                            <TokenAvatar size="xs" address={balance.address} />
                            <Text fontSize="lg">{balance.symbol}</Text>
                        </HStack>
                    </Box>
                    <Box>
                        <Box textAlign="right" fontSize="lg">
                            <Skeleton isLoaded={!isLoading}>{tokenFormatAmount(getAmount(balance.amount))}</Skeleton>
                        </Box>

                        <Box textAlign="right" fontSize="sm" color="gray.200">
                            <Skeleton isLoaded={!isLoading}>
                                {numberFormatUSDValue(
                                    priceForAmount({
                                        address: balance.address,
                                        amount: getAmount(balance.amount),
                                    }),
                                )}
                            </Skeleton>
                        </Box>
                    </Box>
                </CardRow>
            ))}
        </Box>
    );
}
