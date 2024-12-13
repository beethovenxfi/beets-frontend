import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingWithdraw(staking?: GqlPoolStaking | null) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config:
            staking?.type === 'GAUGE'
                ? batchRelayerContractConfig
                : {
                      addressOrName: networkConfig.masterChefContractAddress,
                      contractInterface: BeethovenxMasterChefAbi,
                      functionName: 'emergencyWithdraw',
                  },
        transactionType: 'UNSTAKE',
    });

    function withdraw(options: { amount?: AmountHumanReadable; contractCalls?: string[] }) {
        if (staking) {
            switch (staking.type) {
                case 'GAUGE':
                    return submit({
                        args: [options.contractCalls],
                        toastText: 'Withdraw and claim rewards',
                    });

                case 'FRESH_BEETS':
                case 'MASTER_CHEF':
                default:
                    return submit({
                        args: [staking.farm?.id, userAddress],
                        toastText: 'Unstake',
                    });
            }
        }
    }

    return {
        withdraw,
        ...rest,
    };
}
