import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps, Flex, Skeleton, Text } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import numeral from 'numeral';
import BeetsButton from '~/components/button/Button';
import Link from 'next/link';
import { usePoolUserBalanceEstimate } from '~/modules/pool/detail/lib/usePoolUserBalanceEstimate';
import { useGetTokens } from '~/lib/global/useToken';

interface Props extends BoxProps {}

export function PoolDetailActions({ ...rest }: Props) {
    const { pool } = usePool();
    const totalApr = parseFloat(pool.dynamicData.apr.total);
    const { data, userPoolBalanceUSD, isLoading } = usePoolUserBalanceEstimate();
    const weeklyYield = totalApr / 52;
    const weeklyYieldUSD = userPoolBalanceUSD * weeklyYield;

    return (
        <BeetsBox {...rest} p={4}>
            <Text fontSize="xl" fontWeight="bold" flex={1} textAlign="center">
                At{' '}
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    {` ${numeral(totalApr).format('0.00%')} `}
                </Text>{' '}
                APR, you could earn
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    {` ${numeral(weeklyYield).format('0.00%')} `}
                </Text>
                or approx
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    {isLoading ? ' -- ' : ` ${numeral(weeklyYieldUSD).format('$0,0.00')} `}
                </Text>
                in the next week.
            </Text>
            <Flex pt={8}>
                <Link href={`/pool/${pool.id}/invest`}>
                    <BeetsButton flex={1} mr={2}>
                        Invest
                    </BeetsButton>
                </Link>
                <Link href={`/pool/${pool.id}/withdraw`}>
                    <BeetsButton
                        flex={1}
                        bg="beets.navy.400"
                        _active={{ backgroundColor: 'beets.navy.400' }}
                        color="white"
                        ml={2}
                    >
                        Withdraw
                    </BeetsButton>
                </Link>
            </Flex>
        </BeetsBox>
    );
}
