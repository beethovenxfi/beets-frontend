import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import BalancerPseudoMinterAbi from '~/lib/abi/BalancerPseudoMinter.json';

export function useApproveMinter() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.gauge.balancerPseudoMinterAddress,
            contractInterface: BalancerPseudoMinterAbi,
            functionName: 'setMinterApproval',
        },
        transactionType: 'APPROVE',
    });

    function approve() {
        submit({
            args: [networkConfig.balancer.batchRelayer, true],
            toastText: `Approve batch relayer for minting`,
        });
    }

    return {
        approve,
        ...rest,
    };
}
