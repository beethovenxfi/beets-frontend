import { useStakingPendingRewards } from '~/lib/global/useStakingPendingRewards';
import { useGetTokens } from '~/lib/global/useToken';
import { groupBy, map, sumBy } from 'lodash';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserData } from '~/lib/user/useUserData';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import useStakingMintableRewards from '../global/useStakingMintableRewards';

export function useUserPendingRewards() {
    const networkConfig = useNetworkConfig();
    const { poolBalances, fbeetsBalance, staking, ...userPoolBalancesQuery } = useUserData();

    const { priceForAmount } = useGetTokens();
    const { data, isLoading, ...rest } = useStakingPendingRewards(staking, 'useUserPendingRewards');
    const { claimableBALForGauges, isLoading: isLoadingClaimableBAL } = useStakingMintableRewards(staking);
    const grouped = groupBy(data?.pendingRewards || [], 'address');

    // claimable BAL will also suffer from precision errors
    const totalClaimableBAL = sumBy(Object.values(claimableBALForGauges || {}), (claimableBAL) =>
        parseFloat(claimableBAL),
    );
    const pendingBALUSD = priceForAmount({
        address: networkConfig.balancer.balToken,
        amount: totalClaimableBAL.toString(),
    });
    const pendingRewards: TokenAmountHumanReadable[] = [
        ...map(grouped, (group) => {
            return {
                address: group[0].address,
                //this suffers from precision errors, but its just for display purposes.
                amount: `${sumBy(group, (item) => parseFloat(item.amount))}`,
            };
        }),
    ].filter((reward) => parseFloat(reward.amount) > 0);

    const pendingRewardsTotalUSD = sumBy(data?.pendingRewards || [], priceForAmount);

    const pendingRewardsNonBALTotalUSD = sumBy(
        data?.pendingRewards.filter((reward) => reward.address !== networkConfig.balancer.balToken) || [],
        priceForAmount,
    );

    return {
        pendingRewardsTotalUSD,
        pendingRewardsNonBALTotalUSD,
        pendingRewards,
        pendingBALUSD,
        gauges: data?.gauges,
        ...rest,
        isLoading: isLoading || userPoolBalancesQuery.loading || isLoadingClaimableBAL,
        staking,
        stakingType: staking[0]?.type || 'MASTER_CHEF',
    };
}
