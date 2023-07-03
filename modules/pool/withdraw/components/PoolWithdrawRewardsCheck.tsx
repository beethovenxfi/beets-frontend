import { Alert, AlertIcon } from '@chakra-ui/react';
import { usePoolUserBptBalance } from '../../lib/usePoolUserBptBalance';
import { usePoolUserPendingRewards } from '../../lib/usePoolUserPendingRewards';

interface Props {
    show: boolean;
}
export function PoolWithdrawRewardsCheck({ show }: Props) {
    const { userStakedBptBalance } = usePoolUserBptBalance();
    const { hasPendingRewards } = usePoolUserPendingRewards();

    return userStakedBptBalance && hasPendingRewards && show ? (
        <Alert status="warning" my="4">
            <AlertIcon />
            You still have pending rewards to claim. Please claim them before you withdraw all funds from the pool.
        </Alert>
    ) : null;
}
