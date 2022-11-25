import { Interface } from '@ethersproject/abi';
import GaugeActionsAbi from '~/lib/abi/GaugeActions.json';
import { EncodeGaugeDepositInput } from '~/lib/services/batch-relayer/relayer-types';

export class GaugeActionsService {
    public encodeDeposit(params: EncodeGaugeDepositInput): string {
        const gaugeActionsLibrary = new Interface(GaugeActionsAbi);

        return gaugeActionsLibrary.encodeFunctionData('gaugeDeposit', [
            params.gauge,
            params.sender,
            params.recipient,
            params.amount,
        ]);
    }
}
