import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import ReliquaryAbi from '~/lib/abi/Reliquary.json';

export function useBatchRelayerRelicApprove() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.reliquary.address,
            contractInterface: ReliquaryAbi,
            functionName: 'approve',
        },
        transactionType: 'APPROVE',
    });

    function approve(relicId: number) {
        submit({
            args: [networkConfig.balancer.batchRelayer, relicId],
            toastText: `Approve Relic`,
        });
    }

    return {
        approve,
        ...rest,
    };
}
