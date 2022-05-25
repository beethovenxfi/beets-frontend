import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useQuery } from 'react-query';

export function usePoolBalanceEstimate() {
    const { poolService, pool } = usePool();
    const { userBptBalance } = usePoolUserBalances();

    const userBptRatio = oldBnumToHumanReadable(oldBnumScaleAmount(userBptBalance));

    return useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, userBptRatio],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(userBptRatio);

            return result;
        },
        {},
    );
}
