import { batchRelayerService, BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { StablePoolEncoder, WeightedPoolEncoder } from '@balancer-labs/sdk';
import { BaseProvider } from '@ethersproject/providers';
import { networkProvider } from '~/lib/global/network';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { OutputReference } from '~/lib/services/batch-relayer/relayer-types';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import LiquidityGaugeV5Abi from '~/lib/abi/LiquidityGaugeV5.json';
import ERC20 from '~/lib/abi/ERC20.json';

export class PoolMigrationService {
    constructor(private readonly batchRelayerService: BatchRelayerService, private readonly provider: BaseProvider) {}

    // withdraw from gauge if there is a staked balance -> exit pool -> join pool -> deposit gauge
    public async getOvernightPoolMigrateContractCallData({
        userAddress,
        slippage,
    }: {
        userAddress: string;
        slippage: AmountHumanReadable;
    }): Promise<string[]> {
        const overnightPulsePoolId = '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e';
        const overnightPulsePoolAddress = '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a024';
        const overnightPulseV2PoolId = '0x00';
        const usdPlusLinearPoolAddress = '0x88d07558470484c03d3bb44c3ecc36cafcf43253';
        const daiPlusLinearPoolAddress = '0xb5ad7d6d6f92a77f47f98c28c84893fbccc94809';

        const overnightPulseGaugeAddress = '0xa066243Ba7DAd6C779caA1f9417910a4AE83cf4D';
        const overnightPulseV2GaugeAddress = '0x00';

        const overnightPulseGaugeContract = new Contract(
            overnightPulseGaugeAddress,
            LiquidityGaugeV5Abi,
            this.provider,
        );

        const stakedBalance = await overnightPulseGaugeContract.balanceOf(userAddress);

        let withdrawFromGauge;
        let bptBalance;
        if (BigNumber.from(stakedBalance).gt('0')) {
            // withdrawal also harvest pending rewards to msg.sender
            withdrawFromGauge = this.batchRelayerService.gaugeEncodeWithdraw({
                gauge: overnightPulseGaugeAddress,
                sender: userAddress,
                recipient: networkConfig.balancer.batchRelayer,
                amount: stakedBalance,
            });
            bptBalance = stakedBalance;
        } else {
            const overnightPulsePoolContract = new Contract(overnightPulsePoolAddress, ERC20, this.provider);
            bptBalance = await overnightPulsePoolContract.balanceOf(userAddress);
        }

        const exitPool = this.getExitPoolCallData({
            poolId: overnightPulsePoolId,
            bptIn: bptBalance,
            userAddress: networkConfig.balancer.batchRelayer,
            //we set these to 0 for the peek, they get filled in for the actual call data
            minAmountsOut: ['0', '0'],
            outputReferences: [
                { index: 0, key: this.batchRelayerService.toPersistentChainedReference('1') },
                { index: 1, key: this.batchRelayerService.toPersistentChainedReference('2') },
            ],
        });

        const joinNewPool = this.getJoinCallData({
            userAddress: networkConfig.balancer.batchRelayer,
            assetsIn: [usdPlusLinearPoolAddress, daiPlusLinearPoolAddress],
            poolId: overnightPulseV2PoolId,
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

        const depositNewGauge = this.batchRelayerService.gaugeEncodeDeposit({
            amount: this.batchRelayerService.toPersistentChainedReference('3'),
            gauge: overnightPulseV2GaugeAddress,
            recipient: userAddress,
            sender: networkConfig.balancer.batchRelayer,
        });

        const peekExitOvernightPulseUsdPlusLinear = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('1'),
        );
        const peekExitOvernightPulseDaiPlusLinear = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('2'),
        );
        const peekJoinNewPool = this.batchRelayerService.encodePeekChainedReferenceValue(
            this.batchRelayerService.toPersistentChainedReference('3'),
        );

        if (withdrawFromGauge) {
            const [, , , UsdPlusLinearExitAmount, DaiPlusLinearExitAmount, newPoolBptAmountOut] =
                await this.batchRelayerService.simulateMulticall({
                    provider: this.provider,
                    userAddress,
                    calls: [
                        withdrawFromGauge,
                        exitPool,
                        joinNewPool,
                        peekExitOvernightPulseUsdPlusLinear,
                        peekExitOvernightPulseDaiPlusLinear,
                        peekJoinNewPool,
                    ],
                });

            //below we use the output values of the peek to set our min/max values
            return [
                withdrawFromGauge,
                this.getExitPoolCallData({
                    poolId: overnightPulsePoolId,
                    bptIn: this.batchRelayerService.toChainedReference('0'),
                    userAddress: networkConfig.balancer.batchRelayer,
                    minAmountsOut: [
                        oldBnum(UsdPlusLinearExitAmount)
                            .minus(oldBnum(UsdPlusLinearExitAmount).times(slippage))
                            .toFixed(0),
                        oldBnum(DaiPlusLinearExitAmount)
                            .minus(oldBnum(DaiPlusLinearExitAmount).times(slippage))
                            .toFixed(0),
                    ],
                    outputReferences: [
                        { index: 0, key: this.batchRelayerService.toPersistentChainedReference('1') },
                        { index: 1, key: this.batchRelayerService.toPersistentChainedReference('2') },
                    ],
                }),
                this.getJoinCallData({
                    userAddress: networkConfig.balancer.batchRelayer,
                    poolId: overnightPulseV2PoolId,
                    amountsIn: [
                        this.batchRelayerService.toPersistentChainedReference('1'),
                        this.batchRelayerService.toPersistentChainedReference('2'),
                    ],
                    assetsIn: [usdPlusLinearPoolAddress, daiPlusLinearPoolAddress],
                    maxAmountsIn: [BigNumber.from(UsdPlusLinearExitAmount), BigNumber.from(DaiPlusLinearExitAmount)],
                    minimumBPT: oldBnum(newPoolBptAmountOut)
                        .minus(oldBnum(newPoolBptAmountOut).times(slippage))
                        .toFixed(0),
                    outputReference: this.batchRelayerService.toPersistentChainedReference('3'),
                    fromInternalBalance: true,
                    ethValue: '0',
                }),
                depositNewGauge,
            ];
        }

        const [, , , UsdPlusLinearExitAmount, DaiPlusLinearExitAmount, newPoolBptAmountOut] =
            await this.batchRelayerService.simulateMulticall({
                provider: this.provider,
                userAddress,
                calls: [
                    exitPool,
                    joinNewPool,
                    peekExitOvernightPulseUsdPlusLinear,
                    peekExitOvernightPulseDaiPlusLinear,
                    peekJoinNewPool,
                ],
            });

        //below we use the output values of the peek to set our min/max values
        return [
            this.getExitPoolCallData({
                poolId: overnightPulsePoolId,
                bptIn: this.batchRelayerService.toChainedReference('0'),
                userAddress: networkConfig.balancer.batchRelayer,
                minAmountsOut: [
                    oldBnum(UsdPlusLinearExitAmount).minus(oldBnum(UsdPlusLinearExitAmount).times(slippage)).toFixed(0),
                    oldBnum(DaiPlusLinearExitAmount).minus(oldBnum(DaiPlusLinearExitAmount).times(slippage)).toFixed(0),
                ],
                outputReferences: [
                    { index: 0, key: this.batchRelayerService.toPersistentChainedReference('1') },
                    { index: 1, key: this.batchRelayerService.toPersistentChainedReference('2') },
                ],
            }),
            this.getJoinCallData({
                userAddress: networkConfig.balancer.batchRelayer,
                poolId: overnightPulseV2PoolId,
                amountsIn: [
                    this.batchRelayerService.toPersistentChainedReference('1'),
                    this.batchRelayerService.toPersistentChainedReference('2'),
                ],
                assetsIn: [usdPlusLinearPoolAddress, daiPlusLinearPoolAddress],
                maxAmountsIn: [BigNumber.from(UsdPlusLinearExitAmount), BigNumber.from(DaiPlusLinearExitAmount)],
                minimumBPT: oldBnum(newPoolBptAmountOut).minus(oldBnum(newPoolBptAmountOut).times(slippage)).toFixed(0),
                outputReference: this.batchRelayerService.toPersistentChainedReference('3'),
                fromInternalBalance: true,
                ethValue: '0',
            }),
            depositNewGauge,
        ];
    }

    private getExitPoolCallData({
        poolId,
        bptIn,
        userAddress,
        outputReferences,
        minAmountsOut,
    }: {
        poolId: string;
        bptIn: BigNumberish;
        userAddress: string;
        outputReferences: OutputReference[];
        minAmountsOut: string[];
    }) {
        return this.batchRelayerService.vaultEncodeExitPool({
            poolId: poolId,
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

    private getJoinCallData({
        userAddress,
        amountsIn,
        assetsIn,
        maxAmountsIn,
        poolId,
        outputReference,
        fromInternalBalance,
        ethValue,
        minimumBPT,
    }: {
        userAddress: string;
        amountsIn: BigNumberish[];
        assetsIn: string[];
        maxAmountsIn: BigNumberish[];
        outputReference: BigNumber;
        poolId: string;
        fromInternalBalance: boolean;
        ethValue: BigNumberish;
        minimumBPT: BigNumberish;
    }) {
        return this.batchRelayerService.vaultEncodeJoinPool({
            poolId: poolId,
            poolKind: 0,
            sender: userAddress,
            recipient: networkConfig.balancer.batchRelayer,
            joinPoolRequest: {
                assets: assetsIn,
                userData: StablePoolEncoder.joinExactTokensInForBPTOut(amountsIn, minimumBPT),
                maxAmountsIn,
                fromInternalBalance,
            },
            value: ethValue,
            outputReference,
        });
    }
}

export const reliquaryZapService = new PoolMigrationService(batchRelayerService, networkProvider);
