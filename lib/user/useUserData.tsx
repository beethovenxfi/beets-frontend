import { useGetFbeetsRatioQuery, useGetUserDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sum } from 'lodash';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { makeVar } from '@apollo/client';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { createContext, ReactNode, useContext } from 'react';

const refetchingVar = makeVar(false);
const currentUserAddressVar = makeVar<string | null>(null);

export function _useUserData() {
    const networkConfig = useNetworkConfig();
    const { data: fbeetsRatioData } = useGetFbeetsRatioQuery();
    const { userAddress } = useUserAccount();
    const { data, loading, refetch, ...rest } = useGetUserDataQuery({
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-first',
    });
    const { priceForAmount } = useGetTokens();
    const currentUserAddress = currentUserAddressVar();
    const userAddressChanged = userAddress !== currentUserAddress;
    const fbeetsRatio = parseFloat(fbeetsRatioData?.ratio || '0');

    useAsyncEffect(async () => {
        if (!refetchingVar()) {
            refetchingVar(true);
            await refetch();
            refetchingVar(false);
            currentUserAddressVar(userAddress);
        }
    }, [userAddress]);

    const fbeetsBalance = data?.fbeetsBalance || { totalBalance: '0', stakedBalance: '0', walletBalance: '0' };

    const fbeetsValueUSD = priceForAmount({
        address: networkConfig.fbeets.address,
        amount: fbeetsBalance.totalBalance,
    });

    const poolBalances =
        data?.balances
            .map((balance) => {
                return {
                    ...balance,
                    totalBalanceUSD:
                        parseFloat(balance.totalBalance) * balance.tokenPrice +
                        (balance.poolId === networkConfig.fbeets.poolId ? fbeetsValueUSD : 0),
                };
            })
            .filter((balance) => balance.totalBalanceUSD > networkConfig.minimumDustValueUSD) || [];

    const staking = data?.staking || [];

    const portfolioValueUSD = sum(poolBalances.map((balance) => balance.totalBalanceUSD));

    const stakedValueUSD =
        fbeetsValueUSD + sum(poolBalances.map((balance) => parseFloat(balance.stakedBalance) * balance.tokenPrice));

    function bptBalanceForPool(poolId: string): AmountHumanReadable {
        const bptBalance = poolBalances.find((pool) => pool.poolId === poolId)?.totalBalance || '0';

        if (poolId === networkConfig.fbeets.poolId) {
            const bptInFbeets = parseFloat(fbeetsBalance.totalBalance) + fbeetsRatio;

            return `${bptInFbeets + parseFloat(bptBalance)}`;
        }

        return bptBalance;
    }

    function usdBalanceForPool(poolId: string): number {
        const balanceUSD = poolBalances.find((pool) => pool.poolId === poolId)?.totalBalanceUSD;
        return balanceUSD || 0;
    }

    function hasBptInWalletForPool(poolId: string): boolean {
        const bptBalance = poolBalances.find((pool) => pool.poolId === poolId);

        return parseFloat(bptBalance?.walletBalance || '0') > 0;
    }

    return {
        ...rest,
        loading: loading || userAddressChanged,
        refetch,
        fbeetsValueUSD,
        portfolioValueUSD,
        poolBalances,
        fbeetsBalance,
        staking,
        userPoolIds: [
            ...poolBalances.map((balance) => balance.poolId),
            ...(fbeetsValueUSD > 0 ? [networkConfig.fbeets.poolId] : []),
        ],
        bptBalanceForPool,
        usdBalanceForPool,
        hasBptInWalletForPool,
        stakedValueUSD,
    };
}

export const UserDataContext = createContext<ReturnType<typeof _useUserData> | null>(null);

export function UserDataProvider(props: { children: ReactNode }) {
    const value = _useUserData();

    return <UserDataContext.Provider value={value}>{props.children}</UserDataContext.Provider>;
}

export function useUserData() {
    return useContext(UserDataContext) as ReturnType<typeof _useUserData>;
}
