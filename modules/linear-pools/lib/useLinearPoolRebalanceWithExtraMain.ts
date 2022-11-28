import { GqlPoolLinearFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import LinearPoolRebalancerAbi from '~/lib/abi/LinearPoolRebalancer.json';
import { AmountScaledString } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useLinearPoolRebalanceWithExtraMain(pool: GqlPoolLinearFragment | null) {
    const { balancer } = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: balancer.linearRebalancers[pool?.address || ''],
            contractInterface: LinearPoolRebalancerAbi,
            functionName: 'rebalanceWithExtraMain',
        },
        transactionType: 'UNSTAKE',
    });

    function rebalanceWithExtraMain(extraMain: AmountScaledString) {
        return submit({
            args: [userAddress, extraMain],
            toastText: 'Rebalance linear pool with extra main',
        });
    }

    return {
        rebalanceWithExtraMain,
        ...rest,
    };
}
