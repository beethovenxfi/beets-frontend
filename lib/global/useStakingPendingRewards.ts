import { useQuery } from 'react-query';
import {
    GqlPoolStaking,
    GqlPoolStakingGauge,
    GqlPoolStakingMasterChefFarm,
} from '~/apollo/generated/graphql-codegen-generated';
import { useAccount, useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useGetTokens } from '~/lib/global/useToken';
import { StakingPendingRewardAmount } from '~/lib/services/staking/staking-types';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';

export function useStakingPendingRewards(stakingItems: GqlPoolStaking[]) {
    const provider = useProvider();
    const { data: accountData } = useAccount();
    const { tokens } = useGetTokens();
    const stakingIds = stakingItems.map((staking) => staking.id);

    return useQuery(
        ['useStakingPendingRewards', accountData?.address, stakingIds],
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
                    userAddress: accountData?.address || '',
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
                    userAddress: accountData?.address || '',
                });

                pendingRewards = [...pendingRewards, ...gaugePendingRewards];
            }

            return pendingRewards;
        },
        { enabled: !!accountData?.address && stakingItems.length > 0, refetchInterval: 15000 },
    );
}
