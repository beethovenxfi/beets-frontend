import { batchRelayerService, BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { EncodeGaugeClaimRewardsInput, EncodeGaugeWithdrawInput } from '../batch-relayer/relayer-types';
import { BigNumberish } from '@ethersproject/bignumber';

export class GaugeWithdrawService {
    constructor(private readonly batchRelayerService: BatchRelayerService) {}

    public getGaugeClaimRewardsAndWithdrawContractCallData({
        hasPendingNonBALRewards,
        hasPendingBalRewards,
        gauge,
        sender,
        recipient,
        amount,
    }: {
        hasPendingNonBALRewards: boolean;
        hasPendingBalRewards: boolean;
        gauge: string;
        sender: string;
        recipient: string;
        amount: BigNumberish;
    }) {
        return [
            hasPendingNonBALRewards && this.getGaugeEncodeClaimRewardsCallData({ gauges: [gauge] }),
            this.getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }),
        ];
    }

    private getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }: EncodeGaugeWithdrawInput) {
        this.batchRelayerService.gaugeEncodeWithdraw({ gauge, sender, recipient, amount });
    }

    private getGaugeEncodeClaimRewardsCallData({ gauges }: EncodeGaugeClaimRewardsInput) {
        this.batchRelayerService.gaugeEncodeClaimRewards({ gauges });
    }
}

export const gaugeWithdrawService = new GaugeWithdrawService(batchRelayerService);
