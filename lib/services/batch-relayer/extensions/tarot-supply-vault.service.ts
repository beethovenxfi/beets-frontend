import { Interface } from '@ethersproject/abi';
import tarotWrappingAbi from '~/lib/abi/TarotWrapping.json';
import { EncodeTarotEnterInput, EncodeTarotLeaveInput } from '~/lib/services/batch-relayer/relayer-types';

export class TarotSupplyVaultService {
    public encodeEnter(params: EncodeTarotEnterInput): string {
        const tarotWrappingLibrary = new Interface(tarotWrappingAbi);

        return tarotWrappingLibrary.encodeFunctionData('tarotSupplyVaultEnter', [
            params.supplyVault,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeLeave(params: EncodeTarotLeaveInput): string {
        const tarotWrappingLibrary = new Interface(tarotWrappingAbi);

        return tarotWrappingLibrary.encodeFunctionData('tarotSupplyVaultLeave', [
            params.supplyVault,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}
