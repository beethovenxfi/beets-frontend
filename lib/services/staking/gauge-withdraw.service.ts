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
        const calls: string[] = [];

        if (hasPendingNonBALRewards) {
            calls.push(this.getGaugeEncodeClaimRewardsCallData({ gauges: [gauge] }));
        }

        calls.push(this.getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }));

        return calls;
    }

    private getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }: EncodeGaugeWithdrawInput): string {
        return this.batchRelayerService.gaugeEncodeWithdraw({ gauge, sender, recipient, amount });
    }

    private getGaugeEncodeClaimRewardsCallData({ gauges }: EncodeGaugeClaimRewardsInput): string {
        return this.batchRelayerService.gaugeEncodeClaimRewards({ gauges });
    }
}

export const gaugeWithdrawService = new GaugeWithdrawService(batchRelayerService);
