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
import { GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';
import { poolGetProportionalExitAmountsForBptIn } from '~/lib/services/pool/lib/util';
import { parseUnits } from 'ethers/lib/utils';

export class ReliquaryZapService {
    constructor(private readonly batchRelayerService: BatchRelayerService, private readonly provider: BaseProvider) {}

    //join pool with beets/ftm -> deposit bpt into relic (create relic if no id provided)
    public async getReliquaryDepositContractCallData({
        userAddress,
        beetsAmount,
        ftmAmount,
        slippage,
        isNativeFtm,
        relicId,
    }: {
        userAddress: string;
        beetsAmount: AmountHumanReadable;
        ftmAmount: AmountHumanReadable;
        slippage: AmountHumanReadable;
        isNativeFtm: boolean;
        relicId?: number;
    }): Promise<string[]> {
        const beetsAmountScaled = parseFixed(beetsAmount, 18);
        const ftmAmountScaled = parseFixed(ftmAmount, 18);

        const joinNewFbeets = this.getReliquaryFbeetsJoinCallData({
            userAddress,
            amountsIn: [ftmAmountScaled, beetsAmountScaled],
            maxAmountsIn: [ftmAmountScaled, beetsAmountScaled],
            //this is set to 0 for the peek
            minimumBPT: '0',
            outputReference: this.batchRelayerService.toPersistentChainedReference('0'),
            fromInternalBalance: false,
            ethValue: isNativeFtm ? ftmAmountScaled : '0',
        });

        const relicDepositOrCreateAndDeposit = this.getRelicDepositOrCreateAndDeposit({
            userAddress,
            relicId,
            amount: this.batchRelayerService.toPersistentChainedReference('0'),
        });

        const peekJoinNewFbeetsBpt = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('0'),
        );

        const [, newFbeetsBptAmountOut] = await this.batchRelayerService.simulateMulticall({
            provider: this.provider,
            userAddress,
            calls: [joinNewFbeets, peekJoinNewFbeetsBpt],
        });

        //below we use the output value of the peek to set min bpt amount
        return [
            this.getReliquaryFbeetsJoinCallData({
                userAddress,
                amountsIn: [ftmAmountScaled, beetsAmountScaled],
                maxAmountsIn: [ftmAmountScaled, beetsAmountScaled],
                minimumBPT: oldBnum(newFbeetsBptAmountOut)
                    .minus(oldBnum(newFbeetsBptAmountOut).times(slippage))
                    .toFixed(0),
                outputReference: this.batchRelayerService.toPersistentChainedReference('0'),
                fromInternalBalance: true,
                ethValue: isNativeFtm ? ftmAmountScaled : '0',
            }),
            relicDepositOrCreateAndDeposit,
        ];
    }

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

        const relicDepositOrCreateAndDeposit = this.getRelicDepositOrCreateAndDeposit({
            userAddress,
            relicId,
            amount: this.batchRelayerService.toPersistentChainedReference('3'),
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

    // withdraw bpt from relic -> exit pool with beets/wftm
    public async getReliquaryWithdrawAndHarvestContractCallData({
        userAddress,
        bptAmount,
        relicId,
        slippage,
        poolTokens,
        poolTotalShares,
    }: {
        userAddress: string;
        bptAmount: AmountHumanReadable;
        relicId: number;
        slippage: AmountHumanReadable;
        poolTokens: GqlPoolTokenBase[];
        poolTotalShares: AmountHumanReadable;
    }): Promise<string[]> {
        const bptAmountScaled = parseFixed(bptAmount, 18);

        const withdrawBptFromRelic = this.batchRelayerService.reliquaryEncodeWithdrawAndHarvest({
            recipient: userAddress,
            relicId,
            amount: bptAmountScaled,
            outputReference: this.batchRelayerService.toChainedReference('0'),
        });

        const proportionalAmounts = poolGetProportionalExitAmountsForBptIn(bptAmount, poolTokens, poolTotalShares);

        const exitFbeetsPool = this.getNewFbeetsPoolExitCallData({
            userAddress,
            //we set these to 0 for the peek, they get filled in for the actual call data
            minAmountsOut: proportionalAmounts.map((amount) => {
                const poolToken = poolTokens.find((token) => token.address === amount.address);
                const amountScaled = parseUnits(amount.amount, poolToken?.decimals || 18).toString();

                return oldBnum(amountScaled).minus(oldBnum(amountScaled).times(slippage)).toFixed(0);
            }),
        });

        return [withdrawBptFromRelic, exitFbeetsPool];
    }

    // harvest all relic rewards
    public async getReliquaryHarvestAllContractCallData({
        relicIds,
        recipient,
    }: {
        relicIds: number[];
        recipient: string;
    }) {
        const harvestAll = this.batchRelayerService.reliquaryEncodeHarvestAll({
            relicIds,
            recipient,
        });

        return [harvestAll];
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

    private getRelicDepositOrCreateAndDeposit({
        userAddress,
        relicId,
        amount,
    }: {
        userAddress: string;
        relicId?: number;
        amount: BigNumberish;
    }) {
        return relicId && typeof relicId !== undefined
            ? this.batchRelayerService.reliquaryEncodeDeposit({
                  sender: networkConfig.balancer.batchRelayer,
                  token: networkConfig.reliquary.fbeets.poolAddress,
                  relicId,
                  amount,
                  outputReference: '0',
              })
            : this.batchRelayerService.reliquaryEncodeCreateRelicAndDeposit({
                  sender: networkConfig.balancer.batchRelayer,
                  recipient: userAddress,
                  token: networkConfig.reliquary.fbeets.poolAddress,
                  poolId: networkConfig.reliquary.fbeets.farmId,
                  amount,
                  outputReference: '0',
              });
    }

    private getNewFbeetsPoolExitCallData({
        userAddress,
        minAmountsOut,
    }: {
        userAddress: string;
        minAmountsOut: string[];
    }) {
        return this.batchRelayerService.vaultEncodeExitPool({
            poolId: networkConfig.reliquary.fbeets.poolId,
            poolKind: 0,
            sender: userAddress,
            recipient: userAddress,
            exitPoolRequest: {
                assets: [networkConfig.wethAddress, networkConfig.beets.address],
                minAmountsOut,
                userData: WeightedPoolEncoder.exitExactBPTInForTokensOut(
                    this.batchRelayerService.toChainedReference('0'),
                ),
                toInternalBalance: false,
            },
            outputReferences: [
                { index: 0, key: this.batchRelayerService.toChainedReference('1') },
                { index: 1, key: this.batchRelayerService.toChainedReference('2') },
            ],
        });
    }
}

export const reliquaryZapService = new ReliquaryZapService(batchRelayerService, networkProvider);
