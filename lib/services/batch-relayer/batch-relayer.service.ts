import { VaultActionsService } from '~/lib/services/batch-relayer/extensions/vault-actions.service';
import { AaveWrappingService } from '~/lib/services/batch-relayer/extensions/aave-wrapping.service';
import { BooMirrorWorldStakingService } from '~/lib/services/batch-relayer/extensions/boo-mirror-world-staking.service';
import { TarotSupplyVaultService } from '~/lib/services/batch-relayer/extensions/tarot-supply-vault.service';
import { FBeetsBarStakingService } from '~/lib/services/batch-relayer/extensions/fbeets-bar-staking.service';
import { MasterChefStakingService } from '~/lib/services/batch-relayer/extensions/masterchef-staking.service';
import { YearnWrappingService } from '~/lib/services/batch-relayer/extensions/yearn-wrapping.service';
import { networkConfig } from '~/lib/config/network-config';
import {
    EncodeBatchSwapInput,
    EncodeExitPoolInput,
    EncodeJoinPoolInput,
    EncodeMasterChefDepositInput,
    EncodeMasterChefWithdrawInput,
    ExitPoolData,
} from '~/lib/services/batch-relayer/relayer-types';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export class BatchRelayerService {
    private readonly CHAINED_REFERENCE_PREFIX = 'ba10';

    constructor(
        public readonly batchRelayerAddress: string,
        private readonly vaultActionsService: VaultActionsService,
        private readonly aaveWrappingService: AaveWrappingService,
        private readonly booMirrorWorldStaking: BooMirrorWorldStakingService,
        private readonly tarotSupplyVaultService: TarotSupplyVaultService,
        private readonly fBeetsBarStakingService: FBeetsBarStakingService,
        private readonly masterChefStakingService: MasterChefStakingService,
        private readonly yearnWrappingService: YearnWrappingService,
    ) {}

    public toChainedReference(key: BigNumberish): BigNumber {
        // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
        const paddedPrefix = `0x${this.CHAINED_REFERENCE_PREFIX}${'0'.repeat(
            64 - this.CHAINED_REFERENCE_PREFIX.length,
        )}`;
        return BigNumber.from(paddedPrefix).add(key);
    }

    public vaultEncodeBatchSwap(params: EncodeBatchSwapInput): string {
        return this.vaultActionsService.encodeBatchSwap(params);
    }

    public vaultEncodeExitPool(params: EncodeExitPoolInput): string {
        return this.vaultActionsService.encodeExitPool(params);
    }

    public vaultEncodeJoinPool(params: EncodeJoinPoolInput): string {
        return this.vaultActionsService.encodeJoinPool(params);
    }

    public vaultConstructExitCall(params: ExitPoolData): string {
        return this.vaultActionsService.constructExitCall(params);
    }

    public masterChefEncodeDeposit(params: EncodeMasterChefDepositInput): string {
        return this.masterChefStakingService.encodeDeposit(params);
    }

    public masterChefEncodeWithdraw(params: EncodeMasterChefWithdrawInput): string {
        return this.masterChefStakingService.encodeWithdraw(params);
    }
}

export const batchRelayerService = new BatchRelayerService(
    networkConfig.balancer.batchRelayer,
    new VaultActionsService(),
    new AaveWrappingService(),
    new BooMirrorWorldStakingService(),
    new TarotSupplyVaultService(),
    new FBeetsBarStakingService(),
    new MasterChefStakingService(),
    new YearnWrappingService(),
);
