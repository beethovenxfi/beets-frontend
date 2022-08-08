import { useGetTokens } from '~/lib/global/useToken';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { createContext, ReactNode, useContext } from 'react';

export const UserTokenBalancesContext = createContext<ReturnType<typeof useUserBalances> | null>(null);

export function UserTokenBalancesProvider(props: { children: ReactNode }) {
    const { tokens } = useGetTokens();
    const tokenAddresses = tokens.map((token) => token.address);

    const balances = useUserBalances(tokenAddresses);

    return <UserTokenBalancesContext.Provider value={balances}>{props.children}</UserTokenBalancesContext.Provider>;
}

export const useUserTokenBalances = () => useContext(UserTokenBalancesContext) as ReturnType<typeof useUserBalances>;
