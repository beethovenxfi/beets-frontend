import { useContractRead } from 'wagmi';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useHasBatchRelayerApproval() {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();

    return useContractRead({
        ...vaultContractConfig,
        enabled: typeof userAddress === 'string',
        args: [userAddress, networkConfig.balancer.batchRelayer],
        functionName: 'hasApprovedRelayer',
        watch: true,
    });
}
