import { RelayerAuthorization } from '@balancer-labs/sdk';
import { MaxUint256 } from '@ethersproject/constants';

export const signRelayerApprovalFn = async (
    relayerAddress: string,
    signerAddress: string,
    signer: any,
    vault: any,
): Promise<string> => {
    const approval = vault.interface.encodeFunctionData('setRelayerApproval', [signerAddress, relayerAddress, true]);

    const signature = await RelayerAuthorization.signSetRelayerApprovalAuthorization(
        vault,
        signer,
        relayerAddress,
        approval,
    );

    const calldata = RelayerAuthorization.encodeCalldataAuthorization('0x', MaxUint256, signature);

    return calldata;
};
