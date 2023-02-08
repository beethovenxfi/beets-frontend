import { Flex, Link, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePool } from '~/modules/pool/lib/usePool';

const DEFAULT_AMOUNT = 2000;

export function PoolDetailPossibleYieldText() {
    const { pool, totalApr } = usePool();
    const { data, userPoolBalanceUSD, isLoading } = usePoolUserDepositBalance();
    const weeklyYield = totalApr / 52;
    const userHasBalance = userPoolBalanceUSD > 100;
    const weeklyYieldUSD = (userHasBalance ? userPoolBalanceUSD : DEFAULT_AMOUNT) * weeklyYield;

    return (
        <>
            <Text fontSize="xl" fontWeight="bold" flex={1} textAlign="center">
                At{' '}
                <Text fontSize="3xl" display="inline" color="beets.green" as="span">
                    {` ${numeral(totalApr).format('0.00%')} `}
                </Text>{' '}
                APR, you could earn
                <Text fontSize="3xl" display="inline" color="beets.green" as="span">
                    {` ${numeral(weeklyYield).format('0.00%')} `}
                </Text>
                or approx
                <Text fontSize="3xl" display="inline" color="beets.green" as="span">
                    {isLoading ? ' -- ' : ` ${numeral(weeklyYieldUSD).format('$0,0.00')} `}
                </Text>
                in the next week
                {!userHasBalance ? (
                    <>
                        {' '}
                        if you invest
                        <Text fontSize="3xl" display="inline" color="beets.green" as="span">
                            {isLoading ? ' -- ' : ` ${numeral(DEFAULT_AMOUNT).format('$0,0')}`}
                        </Text>{' '}
                        into this pool.
                    </>
                ) : (
                    '.'
                )}
            </Text>
            <Flex justifyContent="center" mt={4}>
                <Link textDecoration="underline" color="beets.green">
                    Show detailed breakdown
                </Link>
            </Flex>
        </>
    );
}
