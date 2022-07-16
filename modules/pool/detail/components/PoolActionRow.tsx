import { HStack } from '@chakra-ui/layout';
import BeetsButton from '~/components/button/Button';
import { NextLink } from '~/components/link/NextLink';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolInvestModal from '~/modules/pool/invest/components/PoolInvestModal';
import PoolInvestProportional from '~/modules/pool/invest/components/PoolInvestProportional';

type Props = {};

export default function PoolActionRow(props: Props) {
    const { pool } = usePool();

    return (
        <HStack>
            {/* <NextLink href={`/pool/${pool.id}/invest`} chakraProps={{ _hover: { textDecoration: 'none' } }}> */}
            <PoolInvestModal />
            {/* </NextLink> */}
            <NextLink href={`/pool/${pool.id}/withdraw`} chakraProps={{ _hover: { textDecoration: 'none' } }}>
                <BeetsButton buttonType="secondary" width="140px">
                    Withdraw
                </BeetsButton>
            </NextLink>
        </HStack>
    );
}
