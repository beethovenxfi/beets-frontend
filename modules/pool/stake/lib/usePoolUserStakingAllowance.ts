import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';
import { getPoolStaking } from '~/lib/services/pool/lib/util';

export function usePoolUserStakingAllowance() {
    const { pool } = usePool();
    const poolStaking = getPoolStaking(pool);

    const { hasApprovalForAmount, ...rest } = useUserAllowances([pool], poolStaking?.address || '');

    function hasApprovalToStakeAmount(amount: AmountHumanReadable) {
        return hasApprovalForAmount(pool.address, amount);
    }

    return {
        ...rest,
        hasApprovalToStakeAmount,
    };
}
