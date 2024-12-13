import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import ChildChainGaugeRewardHelper from '~/lib/abi/ChildChainGaugeRewardHelper.json';
import LiquidityGaugeV6ABI from '~/lib/abi/LiquidityGaugeV6.json';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingClaimRewards(staking: GqlPoolStaking | null | undefined) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config:
            staking?.type === 'GAUGE'
                ? batchRelayerContractConfig
                : {
                      addressOrName: networkConfig.masterChefContractAddress,
                      contractInterface: BeethovenxMasterChefAbi,
                      functionName: 'harvest',
                  },
        transactionType: 'HARVEST',
    });

    function claim(contractCalls?: string[]) {
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
                        args: [contractCalls],
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
