import { Alert, AlertIcon } from '@chakra-ui/react';
import { usePoolUserBptBalance } from '../../lib/usePoolUserBptBalance';
import { usePoolUserPendingRewards } from '../../lib/usePoolUserPendingRewards';

export function PoolWithdrawRewardsCheck() {
    const { userStakedBptBalance } = usePoolUserBptBalance();
    const { hasPendingRewards } = usePoolUserPendingRewards();

    return userStakedBptBalance && hasPendingRewards ? (
        <Alert status="warning" my="4">
            <AlertIcon />
            You still have pending rewards to claim. Please claim them before you withdraw all funds from the pool.
        </Alert>
    ) : null;
}
