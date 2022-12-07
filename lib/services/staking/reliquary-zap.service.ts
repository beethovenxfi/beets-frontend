import { batchRelayerService, BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { parseFixed } from '@ethersproject/bignumber';
import { WeightedPoolEncoder } from '@balancer-labs/sdk';
import { BaseProvider } from '@ethersproject/providers';
import { networkProvider } from '~/lib/global/network';
import { BigNumber, BigNumberish } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { OutputReference } from '~/lib/services/batch-relayer/relayer-types';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';

export class ReliquaryZapService {
    constructor(private readonly batchRelayerService: BatchRelayerService, private readonly provider: BaseProvider) {}

    // burn fbeets -> exit fidelio duetto -> join new fbeets -> deposit to relic (create relic if no id provided)
    public async getFbeetsMigrateContractCallData({
        userAddress,
        fbeetsAmount,
        slippage,
        relicId,
    }: {
        userAddress: string;
        fbeetsAmount: AmountHumanReadable;
        slippage: AmountHumanReadable;
        relicId?: number;
    }): Promise<string[]> {
        const fbeetsAmountScaled = parseFixed(fbeetsAmount, 18);

        const burnFbeets = this.batchRelayerService.fbeetsBarEncodeLeave({
            sender: userAddress,
            recipient: networkConfig.balancer.batchRelayer,
            amount: fbeetsAmountScaled.toString(),
            outputReference: this.batchRelayerService.toChainedReference('0'),
        });

        const exitFidelioDuetto = this.getExitFidelioCallData({
            bptIn: this.batchRelayerService.toChainedReference('0'),
            userAddress,
            //we set these to 0 for the peek, they get filled in for the actual call data
            minAmountsOut: ['0', '0'],
            outputReferences: [
                { index: 0, key: this.batchRelayerService.toPersistentChainedReference('1') },
                { index: 1, key: this.batchRelayerService.toPersistentChainedReference('2') },
            ],
        });

        const joinNewFbeets = this.getReliquaryFbeetsJoinCallData({
            userAddress,
            amountsIn: [
                this.batchRelayerService.toPersistentChainedReference('1'),
                this.batchRelayerService.toPersistentChainedReference('2'),
            ],
            //we set these to MaxUint256 for the peek, they get filled in for the actual call data
            maxAmountsIn: [MaxUint256, MaxUint256],
            //this is set to 0 for the peek
            minimumBPT: '0',
            outputReference: this.batchRelayerService.toPersistentChainedReference('3'),
            fromInternalBalance: true,
            ethValue: '0',
        });

        const relicDepositOrCreateAndDeposit =
            relicId && typeof relicId !== undefined
                ? this.batchRelayerService.reliquaryEncodeDeposit({
                      sender: networkConfig.balancer.batchRelayer,
                      token: networkConfig.reliquary.fbeets.poolAddress,
                      relicId,
                      amount: this.batchRelayerService.toPersistentChainedReference('3'),
                      outputReference: '0',
                  })
                : this.batchRelayerService.reliquaryEncodeCreateRelicAndDeposit({
                      sender: networkConfig.balancer.batchRelayer,
                      recipient: userAddress,
                      token: networkConfig.reliquary.fbeets.poolAddress,
                      poolId: networkConfig.reliquary.fbeets.farmId,
                      amount: this.batchRelayerService.toPersistentChainedReference('3'),
                      outputReference: '0',
                  });

        const peekExitFidelioDuetoWftm = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('1'),
        );
        const peekExitFidelioDuetoBeets = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('2'),
        );
        const peekJoinNewFbeetsBpt = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('3'),
        );

        const [, , , wftmExitAmount, beetsExitAmount, newFbeetsBptAmountOut] =
            await this.batchRelayerService.simulateMulticall({
                provider: this.provider,
                userAddress,
                calls: [
                    burnFbeets,
                    exitFidelioDuetto,
                    joinNewFbeets,
                    peekExitFidelioDuetoWftm,
                    peekExitFidelioDuetoBeets,
                    peekJoinNewFbeetsBpt,
                ],
            });

        //below we use the output values of the peek to set our min/max values
        return [
            burnFbeets,
            this.getExitFidelioCallData({
                bptIn: this.batchRelayerService.toChainedReference('0'),
                userAddress,
                minAmountsOut: [
                    oldBnum(wftmExitAmount).minus(oldBnum(wftmExitAmount).times(slippage)).toFixed(0),
                    oldBnum(beetsExitAmount).minus(oldBnum(beetsExitAmount).times(slippage)).toFixed(0),
                ],
                outputReferences: [
                    { index: 0, key: this.batchRelayerService.toPersistentChainedReference('1') },
                    { index: 1, key: this.batchRelayerService.toPersistentChainedReference('2') },
                ],
            }),
            this.getReliquaryFbeetsJoinCallData({
                userAddress,
                amountsIn: [
                    this.batchRelayerService.toPersistentChainedReference('1'),
                    this.batchRelayerService.toPersistentChainedReference('2'),
                ],
                maxAmountsIn: [BigNumber.from(wftmExitAmount), BigNumber.from(beetsExitAmount)],
                minimumBPT: oldBnum(newFbeetsBptAmountOut)
                    .minus(oldBnum(newFbeetsBptAmountOut).times(slippage))
                    .toFixed(0),
                outputReference: this.batchRelayerService.toPersistentChainedReference('3'),
                fromInternalBalance: true,
                ethValue: '0',
            }),
            relicDepositOrCreateAndDeposit,
        ];
    }

    private getExitFidelioCallData({
        bptIn,
        userAddress,
        outputReferences,
        minAmountsOut,
    }: {
        bptIn: BigNumberish;
        userAddress: string;
        outputReferences: OutputReference[];
        minAmountsOut: string[];
    }) {
        return this.batchRelayerService.vaultEncodeExitPool({
            poolId: networkConfig.fbeets.poolId,
            poolKind: 0,
            sender: networkConfig.balancer.batchRelayer,
            recipient: userAddress,
            outputReferences,
            exitPoolRequest: {
                assets: [networkConfig.wethAddress, networkConfig.beets.address],
                minAmountsOut,
                userData: WeightedPoolEncoder.exitExactBPTInForTokensOut(bptIn),
                toInternalBalance: true,
            },
        });
    }
    private getReliquaryFbeetsJoinCallData({
        userAddress,
        amountsIn,
        maxAmountsIn,
        outputReference,
        fromInternalBalance,
        ethValue,
        minimumBPT,
    }: {
        userAddress: string;
        outputReference: BigNumber;
        amountsIn: BigNumberish[];
        maxAmountsIn: BigNumberish[];
        fromInternalBalance: boolean;
        ethValue: BigNumberish;
        minimumBPT: BigNumberish;
    }) {
        return this.batchRelayerService.vaultEncodeJoinPool({
            poolId: networkConfig.reliquary.fbeets.poolId,
            poolKind: 0,
            sender: userAddress,
            recipient: networkConfig.balancer.batchRelayer,
            joinPoolRequest: {
                assets: [networkConfig.wethAddress, networkConfig.beets.address],
                userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(amountsIn, minimumBPT),
                maxAmountsIn,
                fromInternalBalance,
            },
            value: ethValue,
            outputReference,
        });
    }
}

export const reliquaryZapService = new ReliquaryZapService(batchRelayerService, networkProvider);
