import { useMasterChefPendingRewards } from '~/lib/global/useMasterChefPendingRewards';
import { useGetTokens } from '~/lib/global/useToken';
import { groupBy, map, sumBy, uniq } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserData } from '~/lib/user/useUserData';
import { GqlPoolStakingMasterChefFarm } from '~/apollo/generated/graphql-codegen-generated';

export function useUserPendingRewards() {
    const { poolBalances, fbeetsBalance, staking, ...userPoolBalancesQuery } = useUserData();
    const { priceForAmount } = useGetTokens();
    const farms = staking.filter((item) => item.farm).map((item) => item.farm) as GqlPoolStakingMasterChefFarm[];
    const { data, isLoading, ...rest } = useMasterChefPendingRewards(farms);
    const pendingRewardsTotalUSD = sumBy(data || [], priceForAmount);

    const grouped = groupBy(data || [], 'address');
    const pendingRewards: TokenAmountHumanReadable[] = map(grouped, (group) => {
        return {
            ...group[0],
            //this suffers from precision errors, but its just for display purposes.
            amount: `${sumBy(group, (item) => parseFloat(item.amount))}`,
        };
    });

    return {
        pendingRewardsTotalUSD,
        pendingRewards,
        ...rest,
        isLoading: isLoading || userPoolBalancesQuery.loading,
    };
}
