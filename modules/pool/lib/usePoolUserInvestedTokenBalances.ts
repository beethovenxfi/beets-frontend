import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function usePoolUserInvestedTokenBalances() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance } = usePoolUserBptBalance();

    const query = useQuery(
        ['poolUserInvestedTokenBalances', pool.id, userTotalBptBalance],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(userTotalBptBalance);

            return result;
        },
        {},
    );

    function getUserInvestedBalance(tokenAddress: string) {
        const balances = query.data ?? [];

        return balances.find((item) => item.address === tokenAddress)?.amount || '0';
    }

    return {
        ...query,
        getUserInvestedBalance,
    };
}
