import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';

export function usePoolExitGetProportionalWithdrawEstimate() {
    const { poolService, pool } = usePool();
    const { userBptBalance } = usePoolUserBalances();
    const { proportionalPercent } = useReactiveVar(withdrawStateVar);

    const userBptRatio = oldBnumToHumanReadable(oldBnumScaleAmount(userBptBalance).times(proportionalPercent / 100));

    return useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, userBptRatio],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(userBptRatio);

            return result;
        },
        {},
    );
}
