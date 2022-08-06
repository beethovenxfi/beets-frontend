import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';

export function usePoolUserInvestedTokenBalances() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance } = usePoolUserBptBalance();
    const { selectedWithdrawTokenAddresses } = useWithdraw();

    const query = useQuery(
        ['poolUserInvestedTokenBalances', pool.id, userTotalBptBalance, selectedWithdrawTokenAddresses],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(
                userTotalBptBalance,
                selectedWithdrawTokenAddresses,
            );

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
