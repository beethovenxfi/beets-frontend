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
import { useRef } from 'react';
import useStakingMintableRewards from './useStakingMintableRewards';
import { useNetworkConfig } from './useNetworkConfig';

function calculateClaimableBAL(stakingItems: GqlPoolStaking[], claimableBALForGauges: Record<string, string>) {
    let claimableBAL = 0;
    for (const stakingItem of stakingItems) {
        if (stakingItem.type === 'GAUGE' && stakingItem.gauge?.version === 2) {
            const claimableBALForGauge = claimableBALForGauges[stakingItem.gauge?.gaugeAddress || ''] || '0';
            claimableBAL += parseFloat(claimableBALForGauge);
        }
    }
    return claimableBAL;
}

export function useStakingPendingRewards(stakingItems: GqlPoolStaking[], hookName: string) {
    const provider = useProvider();
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();
    const { tokens } = useGetTokens();
    const stakingIds = stakingItems.map((staking) => staking.id);
    const isHardRefetch = useRef(false);
    const { claimableBALForGauges, isLoading: isLoadingClaimableBAL } = useStakingMintableRewards(stakingItems);

    const query = useQuery(
        ['useStakingPendingRewards', hookName, userAddress, stakingIds, claimableBALForGauges],
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

            const claimableBALForPool = calculateClaimableBAL(stakingItems, claimableBALForGauges || {});

            pendingRewards = [
                ...pendingRewards,
                {
                    address: networkConfig.balancer.balToken,
                    amount: claimableBALForPool.toString(),
                    id: 'claimable-bal',
                },
            ];

            return {
                pendingRewards: pendingRewards.filter((pendingReward) => parseFloat(pendingReward.amount) > 0),
                gauges: gauges.filter((gauge) => gauge.version !== 1).map((gauge) => gauge.gaugeAddress),
            };
        },
        { enabled: !!userAddress && stakingItems.length > 0, refetchInterval: 15000 },
    );

    async function hardRefetch() {
        isHardRefetch.current = true;
        await query.refetch();
        isHardRefetch.current = false;
    }

    return {
        ...query,
        hardRefetch,
    };
}
