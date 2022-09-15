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

    const investTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const investableAmount = sumBy(investTokens, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );

    function getUserBalanceForToken(address: string): AmountHumanReadable {
        return userBalances.find((balance) => address === balance.address)?.amount || '0';
    }

    const optionsWithLargestBalances = pool.investConfig.options
        .filter((option) => option.tokenOptions.length > 1)
        .map((option) => {
            const tokenOptionWithLargestBalance = orderBy(
                option.tokenOptions,
                (tokenOption) => parseFloat(getUserBalance(tokenOption.address)),
                'desc',
            )[0];

            return { poolTokenIndex: option.poolTokenIndex, tokenAddress: tokenOptionWithLargestBalance.address };
        });

    return {
        ...userBalancesQuery,
        userPoolTokenBalances: userBalances,
        investableAmount,
        getUserBalanceForToken,
        optionsWithLargestBalances,
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
