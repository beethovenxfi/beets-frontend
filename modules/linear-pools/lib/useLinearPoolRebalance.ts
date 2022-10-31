import { GqlPoolLinearFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import LinearPoolRebalancerAbi from '~/lib/abi/LinearPoolRebalancer.json';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useLinearPoolRebalance(pool: GqlPoolLinearFragment | null) {
    const { balancer } = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: balancer.linearRebalancers[pool?.address || ''],
            contractInterface: LinearPoolRebalancerAbi,
            functionName: 'rebalance',
        },
        transactionType: 'STAKE',
    });

    function rebalance() {
        return submit({
            args: [userAddress],
            toastText: 'Rebalance linear pool',
        });
    }

    return {
        rebalance,
        ...rest,
    };
}
