import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function usePoolUserDepositBalance() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, isError, isLoading, error } = usePoolUserBptBalance();
    const { priceForAmount } = useGetTokens();

    const query = useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, userTotalBptBalance],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(userTotalBptBalance);

            return result;
        },
        {},
    );

    return {
        ...query,
        isError: query.isError || isError,
        isLoading: query.isLoading || isLoading,
        error: query.error || error,
        userPoolBalanceUSD: sumBy(query.data || [], priceForAmount),
    };
}
