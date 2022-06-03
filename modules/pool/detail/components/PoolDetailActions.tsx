import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps, Flex } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import BeetsButton from '~/components/button/Button';
import NextLink from 'next/link';
import { PoolDetailPossibleYieldText } from '~/modules/pool/detail/components/PoolDetailPossibleYieldText';

interface Props extends BoxProps {}

export function PoolDetailActions({ ...rest }: Props) {
    const { pool, totalApr } = usePool();

    return (
        <BeetsBox {...rest} p={4}>
            {totalApr > 0.05 ? <PoolDetailPossibleYieldText /> : null}
            <Flex pt={totalApr > 0.05 ? 10 : 4}>
                <NextLink href={`/pool/${pool.id}/invest`} passHref>
                    <BeetsButton flex={1} mr={2}>
                        Invest
                    </BeetsButton>
                </NextLink>
                <NextLink href={`/pool/${pool.id}/withdraw`} passHref>
                    <BeetsButton
                        flex={1}
                        bg="beets.navy.400"
                        _active={{ backgroundColor: 'beets.navy.400' }}
                        color="white"
                        ml={2}
                    >
                        Withdraw
                    </BeetsButton>
                </NextLink>
            </Flex>
        </BeetsBox>
    );
}
