import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function usePoolExitGetProportionalWithdrawEstimate() {
    const { poolService, pool } = usePool();
    const { userWalletBptBalance } = usePoolUserBptBalance();
    const { proportionalPercent } = useReactiveVar(withdrawStateVar);
    const bptIn = oldBnumToHumanReadable(oldBnumScaleAmount(userWalletBptBalance).times(proportionalPercent / 100));

    return useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, bptIn],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(bptIn);

            return result;
        },
        {},
    );
}
