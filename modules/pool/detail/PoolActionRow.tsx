import { HStack } from '@chakra-ui/layout';
import BeetsButton from '~/components/button/Button';
import { NextLink } from '~/components/link/NextLink';
import { usePool } from '~/modules/pool/lib/usePool';

type Props = {};

export default function PoolActionRow(props: Props) {
    const { pool } = usePool();

    return (
        <HStack>
            <NextLink href={`/pool/${pool.id}/invest`} chakraProps={{ _hover: { textDecoration: 'none' } }}>
                <BeetsButton>Add liquidity</BeetsButton>
            </NextLink>
            <NextLink href={`/pool/${pool.id}/withdraw`} chakraProps={{ _hover: { textDecoration: 'none' } }}>
                <BeetsButton buttonType="secondary">Remove liquidity</BeetsButton>
            </NextLink>
        </HStack>
    );
}
