import { useMasterChefPendingRewards } from '~/lib/global/useMasterChefPendingRewards';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';

export function usePoolUserPendingRewards() {
    const { pool } = usePool();
    const { hasBpt, isLoading: balancesLoading } = usePoolUserPoolTokenBalances();
    const { priceForAmount } = useGetTokens();

    const { data, isLoading, ...rest } = useMasterChefPendingRewards(
        pool.staking?.farm && hasBpt ? [pool.staking.farm] : [],
    );

    const pendingRewardsTotalUSD = sumBy(data || [], priceForAmount);

    //TODO: add gauge support here
    return {
        data,
        pendingRewardsTotalUSD,
        ...rest,
        isLoading: isLoading || balancesLoading,
    };
}
