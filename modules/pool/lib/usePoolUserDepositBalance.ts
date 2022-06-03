import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';

export function usePoolUserDepositBalance() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, isError, isLoading, error } = usePoolUserPoolTokenBalances();
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
