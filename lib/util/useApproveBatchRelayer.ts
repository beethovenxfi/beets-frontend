import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useApproveBatchRelayer() {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            ...vaultContractConfig,
            functionName: 'setRelayerApproval',
        },
        transactionType: 'APPROVE',
    });

    function approve() {
        submit({
            args: [userAddress, networkConfig.balancer.batchRelayer, true],
            toastText: `Approve Batch Relayer`,
        });
    }

    return {
        approve,
        ...rest,
    };
}
