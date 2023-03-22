import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { signRelayerApprovalFn } from './sign-relayer-approval';
import { Vault__factory } from '@balancer-labs/typechain';

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

    async function signRelayerApproval(signer: any): Promise<void> {
        const relayerAddress = networkConfig.balancer.batchRelayer;
        const signerAddress = await signer.getAddress();
        const signature = await signRelayerApprovalFn(
            relayerAddress,
            signerAddress,
            signer,
            Vault__factory.connect(networkConfig.balancer.vault, signer),
        );
        console.log({ signature });
    }

    return {
        approve,
        signRelayerApproval,
        ...rest,
    };
}
