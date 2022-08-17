import { useQuery } from 'react-query';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';

export function _usePoolUserInvestedTokenBalances() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, hasBpt } = usePoolUserBptBalance();
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
        { enabled: hasBpt },
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

export const PoolUserInvestedTokenBalanceContext = createContext<ReturnType<
    typeof _usePoolUserInvestedTokenBalances
> | null>(null);

export function PoolUserInvestedTokenBalanceProvider(props: { children: ReactNode }) {
    const value = _usePoolUserInvestedTokenBalances();

    return (
        <PoolUserInvestedTokenBalanceContext.Provider value={value}>
            {props.children}
        </PoolUserInvestedTokenBalanceContext.Provider>
    );
}

export function usePoolUserInvestedTokenBalances() {
    return useContext(PoolUserInvestedTokenBalanceContext) as ReturnType<typeof _usePoolUserInvestedTokenBalances>;
}
