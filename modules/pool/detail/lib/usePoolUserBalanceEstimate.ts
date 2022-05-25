import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';

export function usePoolUserBalanceEstimate() {
    const { poolService, pool } = usePool();
    const { userBptBalance } = usePoolUserBalances();
    const { priceForAmount } = useGetTokens();
    const userBptRatio = oldBnumToHumanReadable(oldBnumScaleAmount(userBptBalance));

    const query = useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, userBptRatio],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(userBptRatio);

            return result;
        },
        {},
    );

    return {
        ...query,
        userPoolBalanceUSD: sumBy(query.data || [], priceForAmount),
    };
}
