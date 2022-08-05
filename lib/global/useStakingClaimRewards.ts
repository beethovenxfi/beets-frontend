import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import ChildChainGaugeRewardHelper from '~/lib/abi/ChildChainGaugeRewardHelper.json';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingClaimRewards(staking: GqlPoolStaking | null) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName:
                staking?.type === 'GAUGE'
                    ? networkConfig.gauge.rewardHelperAddress
                    : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? ChildChainGaugeRewardHelper : BeethovenxMasterChefAbi,
            functionName: staking?.type === 'GAUGE' ? 'claimRewards' : 'harvest',
        },
        transactionType: 'HARVEST',
    });

    function claim() {
        if (staking) {
            switch (staking.type) {
                case 'MASTER_CHEF':
                case 'FRESH_BEETS':
                    return submit({
                        args: [staking.farm?.id, userAddress],
                        toastText: 'Claim pending rewards',
                    });
                case 'GAUGE':
                    return submit({
                        args: [staking.gauge?.gaugeAddress, userAddress],
                        toastText: 'Claim pending rewards',
                    });
            }
        }
    }

    return {
        claim,
        ...rest,
    };
}
