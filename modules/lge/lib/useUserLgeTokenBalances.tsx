import { useUserBalances } from '~/lib/user/useUserBalances';
import { createContext, ReactNode, useContext } from 'react';
import { useLge } from '~/modules/lge/lib/useLge';

export const UserLgeTokenBalancesContext = createContext<ReturnType<typeof useUserBalances> | null>(null);

export function UserLgeTokenBalancesProvider(props: { children: ReactNode }) {
    const { tokens } = useLge();

    const balances = useUserBalances(tokens);

    return (
        <UserLgeTokenBalancesContext.Provider value={balances}>{props.children}</UserLgeTokenBalancesContext.Provider>
    );
}

export const useUserLgeTokenBalances = () =>
    useContext(UserLgeTokenBalancesContext) as ReturnType<typeof useUserBalances>;
