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
    EncodeFBeetsBarEnterInput,
    EncodeFBeetsBarLeaveInput,
    EncodeGaugeDepositInput,
    EncodeJoinPoolInput,
    EncodeMasterChefDepositInput,
    EncodeMasterChefWithdrawInput,
    EncodeReaperUnwrapInput,
    EncodeReaperWrapInput,
    EncodeReliquaryCreateRelicAndDepositInput,
    EncodeReliquaryDepositInput,
    EncodeReliquaryHarvestAllInput,
    EncodeReliquaryWithdrawAndHarvestInput,
    EncodeUnwrapErc4626Input,
    EncodeWrapErc4626Input,
    ExitPoolData,
} from '~/lib/services/batch-relayer/relayer-types';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { AddressZero, MaxUint256, Zero } from '@ethersproject/constants';
import { PoolJoinBatchRelayerContractCallData } from '~/lib/services/pool/pool-types';
import { GqlPoolStable, GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import { isSameAddress, Swaps, SwapType, SwapV2 } from '@balancer-labs/sdk';
import { AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { poolScaleSlippage } from '~/lib/services/pool/lib/util';
import { ReaperWrappingService } from '~/lib/services/batch-relayer/extensions/reaper-wrapping.service';
import { Erc4626WrappingService } from '~/lib/services/batch-relayer/extensions/erc4626-wrapping.service';
import { GaugeActionsService } from '~/lib/services/batch-relayer/extensions/gauge-actions.service';
import { ReliquaryStakingService } from './extensions/reliquary-staking.service';
import BatchRelayerLibraryAbi from '~/lib/abi/BatchRelayerLibrary.json';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import BatchRelayerViewAbi from '~/lib/abi/BatchRelayerView.json';
import { BaseProvider } from '@ethersproject/providers';

export class BatchRelayerService {
    private readonly CHAINED_REFERENCE_PREFIX = 'ba11';
    private readonly TEMP_CHAINED_REFERENCE_PREFIX = 'ba10';

    constructor(
        public readonly batchRelayerAddress: string,
        public readonly wethAddress: string,
        private readonly vaultActionsService: VaultActionsService,
        private readonly aaveWrappingService: AaveWrappingService,
        private readonly booMirrorWorldStaking: BooMirrorWorldStakingService,
        private readonly tarotSupplyVaultService: TarotSupplyVaultService,
        private readonly fBeetsBarStakingService: FBeetsBarStakingService,
        private readonly masterChefStakingService: MasterChefStakingService,
        private readonly reliquaryStakingService: ReliquaryStakingService,
        private readonly yearnWrappingService: YearnWrappingService,
        private readonly reaperWrappingService: ReaperWrappingService,
        private readonly erc4626WrappingService: Erc4626WrappingService,
        private readonly gaugeStakingService: GaugeActionsService,
    ) {}

    public toChainedReference(key: BigNumberish): BigNumber {
        // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
        const paddedPrefix = `0x${this.TEMP_CHAINED_REFERENCE_PREFIX}${'0'.repeat(
            64 - this.TEMP_CHAINED_REFERENCE_PREFIX.length,
        )}`;
        return BigNumber.from(paddedPrefix).add(key);
    }

    public toPersistentChainedReference(key: BigNumberish): BigNumber {
        // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
        const paddedPrefix = `0x${this.CHAINED_REFERENCE_PREFIX}${'0'.repeat(
            64 - this.CHAINED_REFERENCE_PREFIX.length,
        )}`;
        return BigNumber.from(paddedPrefix).add(key);
    }

    public async simulateMulticall({
        provider,
        userAddress,
        calls,
    }: {
        userAddress: string;
        provider: BaseProvider;
        calls: string[];
    }) {
        const batchRelayer = new Contract(this.batchRelayerAddress, BatchRelayerViewAbi, provider);

        return batchRelayer.connect(userAddress).multicall(calls);
    }

    public encodePeekChainedReferenceValue(reference: BigNumberish): string {
        const relayerLibrary = new Interface(BatchRelayerLibraryAbi);

        return relayerLibrary.encodeFunctionData('peekChainedReferenceValue', [reference]);
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

    public reliquaryEncodeCreateRelicAndDeposit(params: EncodeReliquaryCreateRelicAndDepositInput) {
        return this.reliquaryStakingService.encodeCreateRelicAndDeposit(params);
    }

    public reliquaryEncodeDeposit(params: EncodeReliquaryDepositInput) {
        return this.reliquaryStakingService.encodeDeposit(params);
    }

    public reliquaryEncodeWithdrawAndHarvest(params: EncodeReliquaryWithdrawAndHarvestInput) {
        return this.reliquaryStakingService.encodeWithdrawAndHarvest(params);
    }

    public reliquaryEncodeHarvestAll(params: EncodeReliquaryHarvestAllInput) {
        return this.reliquaryStakingService.encodeHarvestAll(params);
    }

    public gaugeEncodeDeposit(params: EncodeGaugeDepositInput): string {
        return this.gaugeStakingService.encodeDeposit(params);
    }

    public reaperEncodeWrap(params: EncodeReaperWrapInput): string {
        return this.reaperWrappingService.encodeWrap(params);
    }

    public reaperEncodeUnwrap(params: EncodeReaperUnwrapInput): string {
        return this.reaperWrappingService.encodeUnwrap(params);
    }

    public erc4626EncodeWrap(params: EncodeWrapErc4626Input): string {
        return this.erc4626WrappingService.encodeWrap(params);
    }

    public erc4626EncodeUnwrap(params: EncodeUnwrapErc4626Input): string {
        return this.erc4626WrappingService.encodeUnwrap(params);
    }

    public fbeetsBarEncodeEnter(params: EncodeFBeetsBarEnterInput) {
        return this.fBeetsBarStakingService.encodeEnter(params);
    }

    public fbeetsBarEncodeLeave(params: EncodeFBeetsBarLeaveInput) {
        return this.fBeetsBarStakingService.encodeLeave(params);
    }

    public encodeJoinPoolAndStakeInMasterChefFarm({
        userAddress,
        pool,
        userData,
        assets,
        maxAmountsIn,
    }: {
        userAddress: string;
        pool: GqlPoolWeighted | GqlPoolStable;
        userData: string;
        assets: string[];
        maxAmountsIn: BigNumberish[];
    }): PoolJoinBatchRelayerContractCallData {
        const ethIndex = assets.findIndex((asset) => asset === AddressZero);
        const ethAmount = ethIndex !== -1 ? maxAmountsIn[ethIndex] : undefined;

        const vaultEncodedJoinPool = this.vaultEncodeJoinPool({
            poolId: pool.id,
            poolKind: 0,
            sender: userAddress,
            recipient: this.batchRelayerAddress,
            joinPoolRequest: {
                assets,
                maxAmountsIn,
                userData,
                fromInternalBalance: false,
            },
            value: ethAmount || Zero,
            outputReference: this.toChainedReference(0),
        });

        const masterChefDeposit = this.masterChefEncodeDeposit({
            sender: this.batchRelayerAddress,
            recipient: userAddress,
            token: pool.address,
            pid: parseInt(pool.staking!.id),
            amount: this.toChainedReference(0),
            outputReference: Zero,
        });

        return {
            type: 'BatchRelayer',
            calls: [vaultEncodedJoinPool, masterChefDeposit],
            ethValue: ethAmount ? ethAmount.toString() : undefined,
        };
    }

    public encodeBatchSwapWithLimits({
        tokensIn,
        tokensOut,
        deltas,
        assets,
        swaps,
        ethAmountScaled,
        slippage,
        fromInternalBalance,
        toInternalBalance,
        sender,
        recipient,
        skipOutputRefs,
    }: {
        tokensIn: string[];
        tokensOut: string[];
        swaps: SwapV2[];
        assets: string[];
        deltas: string[];
        ethAmountScaled: AmountScaledString;
        slippage: string;
        fromInternalBalance: boolean;
        toInternalBalance: boolean;
        sender: string;
        recipient: string;
        skipOutputRefs?: boolean;
    }): string {
        const limits = Swaps.getLimitsForSlippage(
            tokensIn,
            tokensOut,
            SwapType.SwapExactIn,
            deltas,
            assets,
            poolScaleSlippage(slippage),
        );

        return this.vaultEncodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps,
            assets,
            funds: {
                sender,
                recipient,
                fromInternalBalance,
                toInternalBalance,
            },
            limits,
            deadline: MaxUint256,
            value: ethAmountScaled,
            outputReferences: skipOutputRefs
                ? []
                : assets.map((asset, index) => ({
                      index,
                      key: batchRelayerService.toChainedReference(index),
                  })),
        });
    }

    public getUnwrapCallForLinearPoolWithFactory({
        factory,
        wrappedToken,
        sender,
        recipient,
        amount,
        outputReference,
    }: {
        factory: string;
        wrappedToken: string;
        sender: string;
        recipient: string;
        amount: BigNumberish;
        outputReference: BigNumberish;
    }) {
        if (networkConfig.balancer.linearFactories.erc4626.includes(factory)) {
            return this.erc4626EncodeUnwrap({
                wrappedToken,
                sender,
                recipient,
                amount,
                outputReference,
            });
        } else if (networkConfig.balancer.linearFactories.reaper.includes(factory)) {
            return this.reaperEncodeUnwrap({
                vaultToken: wrappedToken,
                sender,
                recipient,
                amount,
                outputReference,
            });
        }

        throw new Error('getUnwrapCallForLinearPoolWithFactory: Unsupported factory');
    }

    public replaceWethWithAddressZero(address: string) {
        return isSameAddress(address, this.wethAddress) ? AddressZero : address;
    }
}

export const batchRelayerService = new BatchRelayerService(
    networkConfig.balancer.batchRelayer,
    networkConfig.wethAddress,
    new VaultActionsService(),
    new AaveWrappingService(),
    new BooMirrorWorldStakingService(),
    new TarotSupplyVaultService(),
    new FBeetsBarStakingService(),
    new MasterChefStakingService(),
    new ReliquaryStakingService(),
    new YearnWrappingService(),
    new ReaperWrappingService(),
    new Erc4626WrappingService(),
    new GaugeActionsService(),
);
