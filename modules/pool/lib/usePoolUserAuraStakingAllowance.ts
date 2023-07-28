import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';

export function usePoolUserAuraStakingAllowance() {
    const { bpt } = usePool();

    const { hasApprovalForAmount, ...rest } = useUserAllowances([bpt], networkConfig.aura.boosterLite);

    function hasApprovalToStakeAmount(amount: AmountHumanReadable) {
        return hasApprovalForAmount(bpt.address, amount);
    }

    return {
        ...rest,
        hasApprovalToStakeAmount,
    };
}
