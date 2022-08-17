import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';

export function _usePoolUserDepositBalance() {
    const { poolService, pool } = usePool();
    const { userTotalBptBalance, isError, isLoading, error } = usePoolUserBptBalance();
    const { priceForAmount } = useGetTokens();
    const { selectedWithdrawTokenAddresses } = useWithdraw();

    const query = useQuery(
        ['usePoolUserDepositBalance', pool.id, userTotalBptBalance, selectedWithdrawTokenAddresses],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(
                userTotalBptBalance,
                selectedWithdrawTokenAddresses,
            );

            return result;
        },
        { enabled: parseFloat(userTotalBptBalance) > 0 },
    );

    return {
        ...query,
        isError: query.isError || isError,
        isLoading: query.isLoading || isLoading,
        error: query.error || error,
        userPoolBalanceUSD: sumBy(query.data || [], priceForAmount),
    };
}

export const PoolUserDepositBalanceContext = createContext<ReturnType<typeof _usePoolUserDepositBalance> | null>(null);

export function PoolUserDepositBalanceProvider(props: { children: ReactNode }) {
    const value = _usePoolUserDepositBalance();

    return (
        <PoolUserDepositBalanceContext.Provider value={value}>{props.children}</PoolUserDepositBalanceContext.Provider>
    );
}

export function usePoolUserDepositBalance() {
    return useContext(PoolUserDepositBalanceContext) as ReturnType<typeof _usePoolUserDepositBalance>;
}
