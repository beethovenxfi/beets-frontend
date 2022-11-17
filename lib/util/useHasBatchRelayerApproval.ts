import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { useMultiCall } from '~/lib/util/useMultiCall';

export function useHasBatchRelayerApproval() {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    const { data, ...rest } = useMultiCall({
        abi: VaultAbi,
        enabled: !!userAddress,
        calls: [
            {
                address: networkConfig.balancer.vault,
                functionName: 'hasApprovedRelayer',
                args: [userAddress, networkConfig.balancer.batchRelayer],
            },
        ],
    });

    return {
        ...rest,
        data: (data ? data[0] : undefined) as boolean | undefined,
    };
}
