import { Alert, AlertIcon } from '@chakra-ui/react';
import { usePoolUserBptBalance } from '../../lib/usePoolUserBptBalance';
import { usePoolUserPendingRewards } from '../../lib/usePoolUserPendingRewards';

export function PoolWithdrawRewardsCheck() {
    const { userStakedBptBalance } = usePoolUserBptBalance();
    const { hasPendingRewards } = usePoolUserPendingRewards();

    return userStakedBptBalance && hasPendingRewards ? (
        <Alert status="warning" my="4">
            <AlertIcon />
            Please claim all pending rewards before you withdraw completely.
        </Alert>
    ) : null;
}
