import { Box, Flex, Image, Text, HStack, Skeleton } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { MultiSelect } from '~/components/multi-select/MultiSelect';
import { usePoolList } from '~/modules/pools/usePoolList';
import { orderBy } from 'lodash';
import { tokenFindTokenAmountForAddress } from '~/lib/services/token/token-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export function PoolListTokenMultiSelect() {
    const { tokens, priceForAmount } = useGetTokens();
    const { state, refetch } = usePoolList();
    const selected = state.where?.tokensIn || [];
    const { userBalances, isLoading: userBalancesLoading } = useUserTokenBalances();

    const tokensWithUserBalances = tokens.map((token) => {
        const userBalance = tokenFindTokenAmountForAddress(token.address, userBalances);
        const userBalanceUSD = priceForAmount(userBalance);

        return { ...token, userBalance: userBalance, userBalanceUSD: userBalanceUSD };
    });

    const filteredTokensByUserBalance = orderBy(
        tokensWithUserBalances,
        ['userBalanceUSD', 'priority'],
        ['desc', 'desc'],
    );

    return (
        <Box>
            <MultiSelect
                options={filteredTokensByUserBalance.map((token) => ({
                    value: token.address,
                    label: token.symbol,
                    imageUrl: token.logoURI,
                    icon: <TokenAvatar address={token.address} size="xs" mr={2} />,
                    bal: token.userBalance,
                    bal2: token.userBalanceUSD,
                }))}
                value={filteredTokensByUserBalance
                    .filter((token) => selected.includes(token.address))
                    .map((token) => ({
                        value: token.address,
                        label: token.symbol,
                        imageUrl: token.logoURI,
                        icon: <TokenAvatar address={token.address} size="xs" mr={2} />,
                        bal: token.userBalance,
                        bal2: token.userBalanceUSD,
                    }))}
                renderOption={(data, children) => (
                    <HStack width="full" paddingY="0" justifyContent="space-between">
                        <HStack>
                            <TokenAvatar address={data.value} size="xs" />
                            <Text fontSize="md">{data.label}</Text>
                        </HStack>
                        <Box marginTop="1px" display="flex" flexDirection="column">
                            {userBalancesLoading ? (
                                <>
                                    <Skeleton width="12" height="3" mb="1" />
                                    <Skeleton width="12" height="3" />
                                </>
                            ) : (
                                <>
                                    <Text textAlign="right">
                                        {parseFloat(data.bal.amount) > 0
                                            ? tokenFormatAmountPrecise(data.bal.amount, 4)
                                            : 'X'}
                                    </Text>
                                    <Text color="gray.200" textAlign="right" fontSize="xs">
                                        {data.bal2 > 0 ? numberFormatUSDValue(data.bal2) : 'Y'}
                                    </Text>
                                </>
                            )}
                        </Box>
                    </HStack>
                    // <>
                    //     {data.icon} <Text fontSize="lg">{data.label}</Text>
                    //     <Text>{data.bal2}</Text>
                    // </>
                )}
                renderMultiValue={(data, children) => (
                    <Flex alignItems="center">
                        {data.imageUrl ? <Image src={data.imageUrl} style={{ width: 20, height: 20 }} mr={1} /> : null}
                        {children}
                    </Flex>
                )}
                placeholder="Filter by token..."
                onChange={(selected) => {
                    refetch({
                        ...state,
                        where: {
                            ...state.where,
                            tokensIn: selected.length > 0 ? selected.map((item) => item.value) : null,
                        },
                    });
                }}
            />
        </Box>
    );
}
