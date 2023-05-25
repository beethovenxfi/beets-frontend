import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import ChildChainGaugeRewardHelper from '~/lib/abi/ChildChainGaugeRewardHelper.json';
import LiquidityGaugeV6ABI from '~/lib/abi/LiquidityGaugeV6.json';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingClaimRewards(staking: GqlPoolStaking | null) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const gaugeABI = staking?.gauge?.version === 1 ? ChildChainGaugeRewardHelper : LiquidityGaugeV6ABI;
    const gaugeFunctionName = staking?.gauge?.version === 1 ? 'claimRewards' : 'claim_rewards()';
    const gaugeAddress =
        staking?.gauge?.version === 1 ? networkConfig.gauge.rewardHelperAddress : staking?.gauge?.gaugeAddress || '';
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: staking?.type === 'GAUGE' ? gaugeAddress : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? gaugeABI : BeethovenxMasterChefAbi,
            functionName: staking?.type === 'GAUGE' ? gaugeFunctionName : 'harvest',
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
                    if (staking.gauge?.version === 1) {
                        return submit({
                            args: [staking.gauge?.gaugeAddress, userAddress],
                            toastText: 'Claim pending rewards',
                        });
                    } else {
                        return submit({
                            args: [],
                            toastText: 'Claim pending rewards',
                        });
                    }
            }
        }
    }

    return {
        claim,
        ...rest,
    };
}
