import { useQuery } from 'react-query';
import {
    GqlPoolStaking,
    GqlPoolStakingGauge,
    GqlPoolStakingMasterChefFarm,
} from '~/apollo/generated/graphql-codegen-generated';
import { useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useGetTokens } from '~/lib/global/useToken';
import { StakingPendingRewardAmount } from '~/lib/services/staking/staking-types';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useStakingPendingRewards(stakingItems: GqlPoolStaking[]) {
    const provider = useProvider();
    const { userAddress } = useUserAccount();
    const { tokens } = useGetTokens();
    const stakingIds = stakingItems.map((staking) => staking.id);

    return useQuery(
        ['useStakingPendingRewards', userAddress, stakingIds],
        async () => {
            let pendingRewards: StakingPendingRewardAmount[] = [];
            const farms = stakingItems
                .filter((staking) => staking.farm)
                .map((staking) => staking.farm) as GqlPoolStakingMasterChefFarm[];

            if (farms.length > 0) {
                const masterchefPendingRewards = await masterChefService.getPendingRewards({
                    farms,
                    provider,
                    tokens,
                    userAddress: userAddress || '',
                });

                pendingRewards = [...pendingRewards, ...masterchefPendingRewards];
            }

            const gauges = stakingItems
                .filter((staking) => staking.gauge)
                .map((staking) => staking.gauge) as GqlPoolStakingGauge[];

            if (gauges.length > 0) {
                const gaugePendingRewards = await gaugeStakingService.getPendingRewards({
                    gauges,
                    provider,
                    tokens,
                    userAddress: userAddress || '',
                });

                pendingRewards = [...pendingRewards, ...gaugePendingRewards];
            }

            return pendingRewards;
        },
        { enabled: !!userAddress && stakingItems.length > 0, refetchInterval: 15000 },
    );
}
