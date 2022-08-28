import { useUserBalances } from '~/lib/user/useUserBalances';
import { sumBy, orderBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';

export function _usePoolUserTokenBalancesInWallet() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);

    const tokenOptionsWithHighestValue = pool.investConfig.options.map((option) => {
        const tokenWithHighestValue = orderBy(
            option.tokenOptions,
            (tokenOption) => priceForAmount({ ...tokenOption, amount: getUserBalanceForToken(tokenOption.address) }),
            'desc',
        )[0].address;

        return {
            address: tokenWithHighestValue,
            amount: getUserBalanceForToken(tokenWithHighestValue),
            hasMultipleTokenOptions: option.tokenOptions.length > 1,
        };
    });

    const investableAmount = sumBy(tokenOptionsWithHighestValue, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );

    function getUserBalanceForToken(address: string): AmountHumanReadable {
        return userBalances.find((balance) => address === balance.address)?.amount || '0';
    }

    return {
        ...userBalancesQuery,
        userPoolTokenBalances: userBalances,
        investableAmount,
        getUserBalanceForToken,
        tokenOptionsWithHighestValue,
    };
}

export const PoolUserTokenBalancesInWalletContext = createContext<ReturnType<
    typeof _usePoolUserTokenBalancesInWallet
> | null>(null);

export function PoolUserTokenBalancesInWalletProvider(props: { children: ReactNode }) {
    const value = _usePoolUserTokenBalancesInWallet();

    return (
        <PoolUserTokenBalancesInWalletContext.Provider value={value}>
            {props.children}
        </PoolUserTokenBalancesInWalletContext.Provider>
    );
}

export function usePoolUserTokenBalancesInWallet() {
    return useContext(PoolUserTokenBalancesInWalletContext) as ReturnType<typeof _usePoolUserTokenBalancesInWallet>;
}
