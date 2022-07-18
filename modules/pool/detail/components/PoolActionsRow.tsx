import { HStack } from '@chakra-ui/layout';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';

type Props = {};

export function PoolActionsRow(props: Props) {
    const { pool } = usePool();

    return (
        <HStack>
            <PoolInvestModal />
            <PoolWithdrawModal />
        </HStack>
    );
}
