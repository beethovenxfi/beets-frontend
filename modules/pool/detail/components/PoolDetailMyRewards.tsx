import { BeetsBox } from '~/components/box/BeetsBox';
import { Box, BoxProps, Flex, Skeleton, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { useGetTokens } from '~/lib/global/useToken';
import BeetsButton from '~/components/button/Button';
import { usePoolUserPendingRewards } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props extends BoxProps {}

export function PoolDetailMyRewards({ ...rest }: Props) {
    const { pool } = usePool();
    const { formattedPrice, getToken } = useGetTokens();
    const { data: pendingRewards, pendingRewardsTotalUSD, isLoading } = usePoolUserPendingRewards();

    return (
        <BeetsBox {...rest}>
            <Box borderBottomWidth={1} p={4} display="flex">
                <Text fontSize="xl" fontWeight="bold" flex={1}>
                    My pending rewards
                </Text>
                <Skeleton isLoaded={!isLoading}>
                    <Text fontSize="xl" fontWeight="bold">
                        {numeral(pendingRewardsTotalUSD).format('$0,0.00')}
                    </Text>
                </Skeleton>
            </Box>
            <Skeleton isLoaded={!isLoading}>
                <Box p={4}>
                    {(pendingRewards || []).map((pendingReward, index) => {
                        const token = getToken(pendingReward.address);

                        if (!token) {
                            return null;
                        }

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
                                    <Text fontSize="xl" textAlign="right">
                                        {tokenFormatAmount(pendingReward.amount)}
                                    </Text>
                                    <Text textAlign="right" color="beets.gray.200">
                                        {formattedPrice(pendingReward)}
                                    </Text>
                                </Box>
                            </Flex>
                        );
                    })}
                </Box>
            </Skeleton>
            <Flex p={4} pt={2}>
                <BeetsButton flex={1}>Harvest rewards</BeetsButton>
            </Flex>
        </BeetsBox>
    );
}
