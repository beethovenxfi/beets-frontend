import { GqlPoolLinearFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import ReaperManualRebalancerAbi from '~/lib/abi/ReaperManualRebalancer.json';
import { AddressZero } from '@ethersproject/constants';
import { AmountScaledString } from '~/lib/services/token/token-types';

export function useReaperLinearPoolLoopingWrap(pool: GqlPoolLinearFragment | null) {
    const { balancer } = useNetworkConfig();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: balancer.reaperManualRebalancer || AddressZero,
            contractInterface: ReaperManualRebalancerAbi,
            functionName: 'wrap',
        },
        transactionType: 'STAKE',
    });

    function wrap(numLoops: string, amountToLoopWith: AmountScaledString) {
        return submit({
            args: [pool?.id, numLoops, amountToLoopWith],
            toastText: 'Looping rebalance wrap',
        });
    }

    return {
        wrap,
        ...rest,
    };
}
