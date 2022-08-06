import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';

export function usePoolUserDepositBalance() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, isError, isLoading, error } = usePoolUserBptBalance();
    const { priceForAmount } = useGetTokens();
    const { selectedWithdrawTokenAddresses } = useWithdraw();

    const query = useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, userTotalBptBalance, selectedWithdrawTokenAddresses],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(
                userTotalBptBalance,
                selectedWithdrawTokenAddresses,
            );

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
