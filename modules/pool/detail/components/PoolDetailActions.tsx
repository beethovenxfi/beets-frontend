import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps, Button, Flex } from '@chakra-ui/react';

import NextLink from 'next/link';
import { PoolDetailPossibleYieldText } from '~/modules/pool/detail/components/PoolDetailPossibleYieldText';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props extends BoxProps {}

export function PoolDetailActions({ ...rest }: Props) {
    const { pool, totalApr } = usePool();

    return (
        <BeetsBox {...rest} p={4}>
            {totalApr > 0.05 ? <PoolDetailPossibleYieldText /> : null}
            <Flex pt={totalApr > 0.05 ? 10 : 4}>
                <NextLink href={`/pool/${pool.id}/invest`} passHref>
                    <Button variant="primary" flex={1} mr={2}>
                        Invest
                    </Button>
                </NextLink>
                <NextLink href={`/pool/${pool.id}/withdraw`} passHref>
                    <Button flex={1} bg="blue.400" _active={{ backgroundColor: 'blue.600' }} color="white" ml={2}>
                        Withdraw
                    </Button>
                </NextLink>
            </Flex>
        </BeetsBox>
    );
}
