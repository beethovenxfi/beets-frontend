import { Interface } from '@ethersproject/abi';
import GaugeActionsAbi from '~/lib/abi/GaugeActions.json';
import {
    EncodeGaugeClaimRewardsInput,
    EncodeGaugeDepositInput,
    EncodeGaugeMintInput,
    EncodeGaugeWithdrawInput,
} from '~/lib/services/batch-relayer/relayer-types';

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

    public encodeWithdraw(params: EncodeGaugeWithdrawInput): string {
        const gaugeActionsLibrary = new Interface(GaugeActionsAbi);

        return gaugeActionsLibrary.encodeFunctionData('gaugeWithdraw', [
            params.gauge,
            params.sender,
            params.recipient,
            params.amount,
        ]);
    }

    public encodeClaimRewards(params: EncodeGaugeClaimRewardsInput): string {
        const gaugeActionsLibrary = new Interface(GaugeActionsAbi);

        return gaugeActionsLibrary.encodeFunctionData('gaugeClaimRewards', [params.gauges]);
    }

    public encodeMint(params: EncodeGaugeMintInput): string {
        const gaugeActionsLibrary = new Interface(GaugeActionsAbi);

        return gaugeActionsLibrary.encodeFunctionData('gaugeMint', [params.gauges, params.outputReference]);
    }
}
