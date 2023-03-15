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

    // TODO: need to check this?
    const fbeetsBalance = data?.fbeetsBalance || { totalBalance: '0', stakedBalance: '0', walletBalance: '0' };
    // filter out the reliquary fbeets pool
    const poolBalances = data?.balances.filter((pool) => pool.poolId !== networkConfig.reliquary.fbeets.poolId) || [];
    // and here...
    const staking = data?.staking.filter((pool) => pool.type !== 'RELIQUARY') || [];
    // get just the reliquary fbeets balance
    const newFbeetsBalance =
        data?.balances.filter((pool) => pool.poolId === networkConfig.reliquary.fbeets.poolId) || [];

    const fbeetsValueUSD = priceForAmount({
        address: networkConfig.fbeets.address,
        amount: fbeetsBalance.totalBalance,
    });

    const newFbeetsValueUSD = sum(
        newFbeetsBalance.map((balance) => parseFloat(balance.totalBalance) * balance.tokenPrice),
    );

    const portfolioValueUSD =
        fbeetsValueUSD +
        newFbeetsValueUSD +
        sum(poolBalances.map((balance) => parseFloat(balance.totalBalance) * balance.tokenPrice));

    const stakedValueUSD =
        priceForAmount({
            address: networkConfig.fbeets.address,
            amount: fbeetsBalance.stakedBalance,
        }) + sum(poolBalances.map((balance) => parseFloat(balance.stakedBalance) * balance.tokenPrice));

    function bptBalanceForPool(poolId: string): AmountHumanReadable {
        const bptBalance = poolBalances.find((pool) => pool.poolId === poolId)?.totalBalance || '0';

        if (poolId === networkConfig.fbeets.poolId) {
            const bptInFbeets = parseFloat(fbeetsBalance.totalBalance) + fbeetsRatio;

            return `${bptInFbeets + parseFloat(bptBalance)}`;
        }

        return bptBalance;
    }

    function usdBalanceForPool(poolId: string): number {
        if (poolId === networkConfig.fbeets.poolId) {
            const bptBalance = poolBalances.find((pool) => pool.poolId === poolId);
            const bptValueUSD = bptBalance ? bptBalance.tokenPrice * parseFloat(bptBalance.totalBalance) : 0;

            return fbeetsValueUSD + bptValueUSD;
        }

        if (poolId === networkConfig.reliquary.fbeets.poolId) {
            return newFbeetsValueUSD;
        }

        const balance = poolBalances.find((pool) => pool.poolId === poolId);

        if (!balance) {
            return 0;
        }

        return balance.tokenPrice * parseFloat(balance.totalBalance);
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
        newFbeetsValueUSD,
        portfolioValueUSD,
        poolBalances,
        fbeetsBalance,
        staking,
        userPoolIds: [
            ...poolBalances.map((balance) => balance.poolId),
            ...(fbeetsValueUSD > 0 ? [networkConfig.fbeets.poolId] : []),
            ...(newFbeetsValueUSD > 0 ? [networkConfig.reliquary.fbeets.poolId] : []),
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
