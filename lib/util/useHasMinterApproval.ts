import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useMultiCall } from '~/lib/util/useMultiCall';
import BalancerPseudoMinterAbi from '~/lib/abi/BalancerPseudoMinter.json';

export function useHasMinterApproval() {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { data, ...rest } = useMultiCall({
        abi: BalancerPseudoMinterAbi,
        enabled: !!userAddress && networkConfig.gaugeEnabled,
        calls: [
            {
                address: networkConfig.gauge.balancerPseudoMinterAddress,
                functionName: 'getMinterApproval',
                args: [networkConfig.balancer.batchRelayer, userAddress],
            },
        ],
    });

    return {
        ...rest,
        data: (data ? data[0] : undefined) as boolean | undefined,
    };
}
