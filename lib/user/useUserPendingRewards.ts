import { useStakingPendingRewards } from '~/lib/global/useStakingPendingRewards';
import { useGetTokens } from '~/lib/global/useToken';
import { groupBy, map, sumBy } from 'lodash';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserData } from '~/lib/user/useUserData';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useUserPendingRewards() {
    const networkConfig = useNetworkConfig();
    const { poolBalances, fbeetsBalance, staking, ...userPoolBalancesQuery } = useUserData();
    const { priceForAmount } = useGetTokens();
    const { data, isLoading, ...rest } = useStakingPendingRewards(staking, 'useUserPendingRewards');
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
        staking,
        stakingType: staking[0]?.type || 'MASTER_CHEF',
    };
}
