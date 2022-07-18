import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { usePool } from '~/modules/pool/lib/usePool';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolUserStakingAllowance() {
    const { pool } = usePool();

    const { hasApprovalForAmount, ...rest } = useUserAllowances([pool], pool.staking?.address || '');

    function hasApprovalToStakeAmount(amount: AmountHumanReadable) {
        return hasApprovalForAmount(pool.address, amount);
    }

    return {
        ...rest,
        hasApprovalToStakeAmount,
    };
}
