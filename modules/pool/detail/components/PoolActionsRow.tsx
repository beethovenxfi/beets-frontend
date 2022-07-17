import { HStack } from '@chakra-ui/layout';
import BeetsButton from '~/components/button/Button';
import { NextLink } from '~/components/link/NextLink';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';

type Props = {};

export function PoolActionsRow(props: Props) {
    const { pool } = usePool();

    return (
        <HStack>
            <PoolInvestModal />
            <NextLink href={`/pool/${pool.id}/withdraw`} chakraProps={{ _hover: { textDecoration: 'none' } }}>
                <BeetsButton buttonType="secondary" width="140px">
                    Withdraw
                </BeetsButton>
            </NextLink>
        </HStack>
    );
}
