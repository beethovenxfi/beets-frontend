import { useMasterChefPendingRewards } from '~/lib/global/useMasterChefPendingRewards';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy, uniq } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function usePoolUserPendingRewards() {
    const { pool } = usePool();
    const { hasBpt, isLoading: balancesLoading } = usePoolUserBptBalance();
    const { priceForAmount } = useGetTokens();
    const farm = pool.staking?.farm;
    const hasBeetsRewards = parseFloat(farm?.beetsPerBlock || '0') > 0;

    const { data, isLoading, ...rest } = useMasterChefPendingRewards(farm && hasBpt ? [farm] : []);

    const pendingRewardsTotalUSD = sumBy(data || [], priceForAmount);
    const rewardTokens = uniq([
        ...(hasBeetsRewards ? [networkConfig.beets.address] : []),
        ...(farm?.rewarders || []).map((rewarder) => rewarder.tokenAddress),
    ]);

    const pendingRewards: TokenAmountHumanReadable[] = rewardTokens.map((rewardToken) => {
        const pending = (data || []).find((data) => data.address === rewardToken);

        return pending || { address: rewardToken, amount: '0' };
    });

    return {
        pendingRewards,
        pendingRewardsTotalUSD,
        ...rest,
        isLoading: isLoading || balancesLoading,
    };
}
