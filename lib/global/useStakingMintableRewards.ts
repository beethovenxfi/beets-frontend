import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BalancerPseudoMinter from '~/lib/abi/BalancerPseudoMinter.json';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingMintableRewards(staking: GqlPoolStaking | null) {
    const networkConfig = useNetworkConfig();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.gauge.balancerPseudoMinterAddress,
            contractInterface: BalancerPseudoMinter,
            functionName: 'mint',
        },
        transactionType: 'HARVEST',
    });

    function mint() {
        if (staking) {
            if (staking.type !== 'GAUGE') {
                throw new Error('Minting only supported for gauges.');
            }

            return submit({
                args: [staking.gauge?.gaugeAddress],
                toastText: 'Claim pending BAL rewards',
            });
        }
    }

    return {
        mint,
        ...rest,
    };
}
