import { batchRelayerService, BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import {
    EncodeGaugeClaimRewardsInput,
    EncodeGaugeMintInput,
    EncodeGaugeWithdrawInput,
} from '../batch-relayer/relayer-types';
import { BigNumberish } from '@ethersproject/bignumber';

export class GaugeService {
    constructor(private readonly batchRelayerService: BatchRelayerService) {}

    public getGaugeClaimRewardsAndWithdrawContractCallData({
        hasPendingNonBALRewards,
        hasPendingBalRewards,
        gauge,
        sender,
        recipient,
        amount,
        outputReference,
    }: {
        hasPendingNonBALRewards: boolean;
        hasPendingBalRewards: boolean;
        gauge: string;
        sender: string;
        recipient: string;
        amount: BigNumberish;
        outputReference: BigNumberish;
    }) {
        const calls: string[] = [];

        if (hasPendingNonBALRewards) {
            calls.push(this.getGaugeEncodeClaimRewardsCallData({ gauges: [gauge] }));
        }

        if (hasPendingBalRewards) {
            calls.push(this.getGaugeEncodeMintCallData({ gauges: [gauge], outputReference }));
        }

        calls.push(this.getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }));

        return calls;
    }

    private getGaugeEncodeWithdrawCallData({ gauge, sender, recipient, amount }: EncodeGaugeWithdrawInput): string {
        return this.batchRelayerService.gaugeEncodeWithdraw({ gauge, sender, recipient, amount });
    }

    public getGaugeEncodeClaimRewardsCallData({ gauges }: EncodeGaugeClaimRewardsInput): string {
        return this.batchRelayerService.gaugeEncodeClaimRewards({ gauges });
    }

    public getGaugeEncodeMintCallData({ gauges, outputReference }: EncodeGaugeMintInput): string {
        return this.batchRelayerService.gaugeEncodeMint({ gauges, outputReference });
    }
}

export const gaugeService = new GaugeService(batchRelayerService);
