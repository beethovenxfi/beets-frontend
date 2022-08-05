import { Interface } from '@ethersproject/abi';
import YearnWrappingAbi from '~/lib/abi/YearnWrapping.json';
import { EncodeUnwrapYearnVaultTokenInput } from '~/lib/services/batch-relayer/relayer-types';

export class YearnWrappingService {
    public encodeWrap(params: EncodeUnwrapYearnVaultTokenInput): string {
        const yearnWrappingLibrary = new Interface(YearnWrappingAbi);

        return yearnWrappingLibrary.encodeFunctionData('wrapYearnVaultToken', [
            params.vaultToken,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeUnwrap(params: EncodeUnwrapYearnVaultTokenInput): string {
        const yearnWrappingLibrary = new Interface(YearnWrappingAbi);

        return yearnWrappingLibrary.encodeFunctionData('unwrapYearnVaultToken', [
            params.vaultToken,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}
