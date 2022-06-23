import { useGetUserBalancesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sum } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

export function useUserPoolBalances() {
    const { data, ...rest } = useGetUserBalancesQuery({ pollInterval: 5000 });
    const { priceForAmount } = useGetTokens();

    const fbeetsBalance = data?.fbeetsBalance || { totalBalance: '0', stakedBalance: '0', walletBalance: '0' };
    const poolBalances = data?.balances || [];

    const fbeetsValueUSD = priceForAmount({
        address: networkConfig.fbeets.address,
        amount: fbeetsBalance.totalBalance,
    });
    const portfolioValueUSD =
        fbeetsValueUSD +
        sum(
            poolBalances.map((balance) =>
                priceForAmount({ address: balance.tokenAddress, amount: balance.totalBalance }),
            ),
        );

    function bptBalanceForPool(poolId: string): AmountHumanReadable {
        return poolBalances.find((pool) => pool.poolId === poolId)?.totalBalance || '0';
    }

    function usdBalanceForPool(poolId: string): number {
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
        userPoolIds: poolBalances.map((balance) => balance.poolId),
        bptBalanceForPool,
        usdBalanceForPool,
    };
}
