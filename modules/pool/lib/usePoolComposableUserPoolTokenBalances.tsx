import { useQuery } from 'react-query';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';

export function _usePoolComposableUserPoolTokenBalances() {
    const { poolService, pool, isComposablePool } = usePool();
    const { userTotalBptBalance, hasBpt } = usePoolUserBptBalance();

    const query = useQuery(
        ['poolComposableUserPoolTokenBalances', pool.id, userTotalBptBalance],
        async () => {
            if (!poolService.exitGetProportionalPoolTokenWithdrawEstimate) {
                return [];
            }

            return poolService.exitGetProportionalPoolTokenWithdrawEstimate(userTotalBptBalance);
        },
        { enabled: hasBpt && isComposablePool },
    );

    function getUserPoolTokenBalance(tokenAddress: string) {
        const balances = query.data ?? [];

        return balances.find((item) => item.address === tokenAddress)?.amount || '0';
    }

    return {
        ...query,
        getUserPoolTokenBalance,
    };
}

export const PoolComposableUserPoolTokenBalanceContext = createContext<ReturnType<
    typeof _usePoolComposableUserPoolTokenBalances
> | null>(null);

export function PoolComposableUserPoolTokenBalanceProvider(props: { children: ReactNode }) {
    const value = _usePoolComposableUserPoolTokenBalances();

    return (
        <PoolComposableUserPoolTokenBalanceContext.Provider value={value}>
            {props.children}
        </PoolComposableUserPoolTokenBalanceContext.Provider>
    );
}

export function usePoolComposableUserPoolTokenBalances() {
    return useContext(PoolComposableUserPoolTokenBalanceContext) as ReturnType<
        typeof _usePoolComposableUserPoolTokenBalances
    >;
}
