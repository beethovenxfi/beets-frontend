import { useGetUserDataLazyQuery, useGetUserDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sum } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useEffect } from 'react';

export function useUserData() {
    const [getUserData, { data, ...rest }] = useGetUserDataLazyQuery({ pollInterval: 30000 });
    const { priceForAmount } = useGetTokens();
    const { userAddress } = useUserAccount();

    useEffect(() => {
        getUserData({ pollInterval: userAddress ? 30000 : undefined });
    }, [userAddress]);

    const fbeetsBalance = data?.fbeetsBalance || { totalBalance: '0', stakedBalance: '0', walletBalance: '0' };
    const poolBalances = data?.balances || [];
    const staking = data?.staking || [];

    const fbeetsValueUSD = priceForAmount({
        address: networkConfig.fbeets.address,
        amount: fbeetsBalance.totalBalance,
    });

    const portfolioValueUSD =
        fbeetsValueUSD + sum(poolBalances.map((balance) => parseFloat(balance.totalBalance) * balance.tokenPrice));

    const stakedValueUSD =
        priceForAmount({
            address: networkConfig.fbeets.address,
            amount: fbeetsBalance.stakedBalance,
        }) + sum(poolBalances.map((balance) => parseFloat(balance.stakedBalance) * balance.tokenPrice));

    function bptBalanceForPool(poolId: string): AmountHumanReadable {
        return poolBalances.find((pool) => pool.poolId === poolId)?.totalBalance || '0';
    }

    function usdBalanceForPool(poolId: string): number {
        if (poolId === networkConfig.fbeets.poolId) {
            const bptBalance = poolBalances.find((pool) => pool.poolId === poolId);
            const bptValueUSD = bptBalance ? bptBalance.tokenPrice * parseFloat(bptBalance.totalBalance) : 0;

            return fbeetsValueUSD + bptValueUSD;
        }

        const balance = poolBalances.find((pool) => pool.poolId === poolId);

        if (!balance) {
            return 0;
        }

        return balance.tokenPrice * parseFloat(balance.totalBalance);
    }

    return {
        ...rest,
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
        stakedValueUSD,
    };
}
