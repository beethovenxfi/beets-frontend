import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import ChildChainGaugeRewardHelper from '~/lib/abi/ChildChainGaugeRewardHelper.json';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';

export function useStakingClaimRewards(staking: GqlPoolStaking | null) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName:
                staking?.type === 'GAUGE'
                    ? networkConfig.gauge.rewardHelperAddress
                    : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? ChildChainGaugeRewardHelper : BeethovenxMasterChefAbi,
        },
        functionName: staking?.type === 'GAUGE' ? 'claimRewards' : 'harvest',
        transactionType: 'HARVEST',
    });

    function claim() {
        if (staking) {
            switch (staking.type) {
                case 'MASTER_CHEF':
                case 'FRESH_BEETS':
                    return submit({
                        args: [staking.farm?.id, accountData?.address],
                        toastText: 'Claim pending rewards',
                    });
                case 'GAUGE':
                    return submit({
                        args: [staking.gauge?.gaugeAddress, accountData?.address],
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
