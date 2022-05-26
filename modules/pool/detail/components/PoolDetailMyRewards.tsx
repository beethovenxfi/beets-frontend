import { BeetsBox } from '~/components/box/BeetsBox';
import { Box, BoxProps, Flex, Skeleton, Text } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import BeetsButton from '~/components/button/Button';

interface Props extends BoxProps {}

export function PoolDetailMyRewards({ ...rest }: Props) {
    const { pool } = usePool();
    const { data, isLoading, userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { formattedPrice } = useGetTokens();

    return (
        <BeetsBox {...rest}>
            <Box borderBottomWidth={1} p={4} display="flex">
                <Text fontSize="xl" fontWeight="bold" flex={1}>
                    My pending rewards
                </Text>
                <Skeleton isLoaded={!isLoading}>
                    <Text fontSize="xl" fontWeight="bold">
                        {numeral(userPoolBalanceUSD).format('$0,0.00')}
                    </Text>
                </Skeleton>
            </Box>
            <Box p={4}>
                {pool.tokens.slice(0, 1).map((token, index) => {
                    const amount = data?.find((balance) => balance.address === token.address)?.amount || '0';

                    return (
                        <Flex key={index} pb={4}>
                            <TokenAvatar address={token.address} size="sm" mr={4} mt={1} />
                            <Box flex={1}>
                                <Text fontSize="xl" flex={1}>
                                    {token.symbol}
                                </Text>
                                <Text color="beets.gray.200">{token.name}</Text>
                            </Box>

                            <Box>
                                {isLoading ? (
                                    <Skeleton height="24px" mb={2} width="20" />
                                ) : (
                                    <Text fontSize="xl" textAlign="right">
                                        {tokenFormatAmount(amount)}
                                    </Text>
                                )}
                                {isLoading ? (
                                    <Skeleton height="16px" width="20" />
                                ) : (
                                    <Text textAlign="right" color="beets.gray.200">
                                        {formattedPrice({ address: token.address, amount })}
                                    </Text>
                                )}
                            </Box>
                        </Flex>
                    );
                })}
            </Box>
            <Flex p={4}>
                <BeetsButton flex={1}>Harvest rewards</BeetsButton>
            </Flex>
        </BeetsBox>
    );
}
