import { BeetsBox } from '~/components/box/BeetsBox';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsButton from '~/components/button/Button';
import Link from 'next/link';

interface Props extends BoxProps {}

export function PoolDetailActions({ ...rest }: Props) {
    const { pool } = usePool();

    return (
        <BeetsBox {...rest} p={4}>
            <Text fontSize="xl" fontWeight="bold" flex={1} textAlign="center">
                At{' '}
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    65%
                </Text>{' '}
                APR, you will earn{' '}
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    1.32%
                </Text>{' '}
                or approx{' '}
                <Text fontSize="3xl" display="inline" color="beets.green.300">
                    $65.09
                </Text>{' '}
                in a week.
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
