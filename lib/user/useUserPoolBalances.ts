import { useGetUserBalancesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sum } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';

export function useUserPoolBalances() {
    const { data, ...rest } = useGetUserBalancesQuery({ pollInterval: 5000 });
    const { priceForAmount } = useGetTokens();

    const poolBalances = data?.balances || [];
    const fbeetsBalance = data?.fbeetsBalance || { totalBalance: '0', stakedBalance: '0', walletBalance: '0' };

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

    function balanceForPool(poolId: string) {
        return poolBalances.find((pool) => pool.poolId === poolId)?.totalBalance || '0';
    }

    return {
        ...rest,
        fbeetsValueUSD,
        portfolioValueUSD,
        poolBalances,
        fbeetsBalance,
        userPoolIds: poolBalances.map((balance) => balance.poolId),
        balanceForPool,
    };
}
