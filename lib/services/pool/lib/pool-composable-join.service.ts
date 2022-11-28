import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinBatchSwapStep,
    ComposablePoolJoinPoolStep,
    ComposablePoolJoinProcessedBatchSwapStep,
    ComposablePoolJoinProcessedJoinPoolStep,
    ComposablePoolJoinProcessedStepsOutput,
    ComposablePoolJoinStep,
    ComposablePoolProcessedJoinStep,
    PoolJoinBatchRelayerContractCallData,
    PoolJoinExactTokensInForBPTOut,
    PoolWithPossibleNesting,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { sortBy } from 'lodash';
import { Zero } from '@ethersproject/constants';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { parseUnits } from 'ethers/lib/utils';
import { StablePoolEncoder, SwapV2 } from '@balancer-labs/sdk';
import { oldBnum, oldBnumSubtractSlippage } from '~/lib/services/pool/lib/old-big-number';
import {
    poolBatchSwaps,
    poolGetEthAmountFromJoinData,
    poolGetMainTokenFromLinearPoolToken,
    poolGetNestedLinearPoolTokens,
    poolGetNestedStablePoolTokens,
    poolQueryBatchSwap,
    poolStableBptForTokensZeroPriceImpact,
    poolStableExactTokensInForBPTOut,
    poolWeightedBptForTokensZeroPriceImpact,
    poolWeightedExactTokensInForBPTOut,
    tokenAmountsAllZero,
} from '~/lib/services/pool/lib/util';
import { BaseProvider } from '@ethersproject/providers';
import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import { SwapTypes } from '@balancer-labs/sor';
import { BigNumber } from 'ethers';

export class PoolComposableJoinService {
    constructor(
        private pool: PoolWithPossibleNesting,
        private readonly batchRelayerService: BatchRelayerService,
        private readonly provider: BaseProvider,
        private readonly wethAddress: string,
    ) {}

    public updatePool(pool: PoolWithPossibleNesting) {
        this.pool = pool;
    }

    public get joinSteps(): ComposablePoolJoinStep[] {
        const steps: ComposablePoolJoinStep[] = [];
        const nestedLinearPoolTokens = poolGetNestedLinearPoolTokens(this.pool);
        const nestedStablePoolTokens = poolGetNestedStablePoolTokens(this.pool);

        if (nestedLinearPoolTokens.length > 0) {
            steps.push({
                type: 'BatchSwap',
                swaps: nestedLinearPoolTokens.map((linearPoolToken) => {
                    const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

                    return {
                        poolId: linearPoolToken.pool.id,
                        tokenIn: mainToken.address,
                        tokenOut: linearPoolToken.address,
                    };
                }),
                tokensIn: nestedLinearPoolTokens.map((linearPoolToken) => {
                    const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

                    return mainToken.address;
                }),
            });
        }

        for (const nestedStablePoolToken of nestedStablePoolTokens) {
            steps.push({
                type: 'Join',
                pool: nestedStablePoolToken.pool,
                tokensIn: nestedStablePoolToken.pool.tokens.map((token) => token.address),
            });
        }

        //the last step is always joining the pool itself
        steps.push({
            type: 'Join',
            pool: this.pool,
            tokensIn: this.pool.tokens.map((token) => token.address),
        });

        return steps;
    }

    public async processJoinSteps({
        tokenAmountsIn,
        slippage,
    }: {
        tokenAmountsIn: TokenAmountHumanReadable[];
        slippage: AmountHumanReadable;
    }): Promise<ComposablePoolJoinProcessedStepsOutput> {
        const processedSteps: ComposablePoolProcessedJoinStep[] = [];
        let currentTokenAmountsIn = tokenAmountsIn.filter((amount) => parseFloat(amount.amount) > 0);

        for (const step of this.joinSteps) {
            const joinAmountsIn = currentTokenAmountsIn.filter((amountIn) => step.tokensIn.includes(amountIn.address));

            if (joinAmountsIn.length === 0) {
                continue;
            }

            if (step.type === 'Join') {
                const joinPoolResponse = await this.joinStepGetJoinPool({
                    joinStep: step,
                    tokenAmountsIn: joinAmountsIn,
                });

                currentTokenAmountsIn = [
                    ...currentTokenAmountsIn.filter((amountIn) => !step.tokensIn.includes(amountIn.address)),
                    //TODO: should this take slippage into account
                    { address: step.pool.address, amount: joinPoolResponse.minBptReceived },
                ];

                processedSteps.push(joinPoolResponse);
            } else if (step.type === 'BatchSwap') {
                const joinSwapResponse = await this.joinStepGetJoinBatchSwap({
                    pool: this.pool,
                    batchSwapStep: step,
                    tokenAmountsIn: joinAmountsIn,
                    provider: this.provider,
                });

                currentTokenAmountsIn = [
                    ...currentTokenAmountsIn.filter((amountIn) => !step.tokensIn.includes(amountIn.address)),
                    ...joinSwapResponse.tokenAmountsOut,
                ];

                processedSteps.push(joinSwapResponse);
            }
        }

        const processedJoinSteps = processedSteps.filter(
            (step) => step.type === 'Join',
        ) as ComposablePoolJoinProcessedJoinPoolStep[];
        const lastJoinStep = processedJoinSteps[processedJoinSteps.length - 1];

        return {
            processedSteps,
            priceImpact: lastJoinStep.priceImpact,
            minBptReceived: lastJoinStep.minBptReceived,
            nestedPriceImpacts: processedJoinSteps.slice(0, processedJoinSteps.length - 1).map((step) => ({
                ...step,
                poolId: step.pool.id,
            })),
        };
    }

    public async joinGetContractCallData({
        data,
        processedSteps,
    }: {
        data: PoolJoinExactTokensInForBPTOut;
        processedSteps: ComposablePoolProcessedJoinStep[];
    }): Promise<PoolJoinBatchRelayerContractCallData> {
        const calls: string[] = [];
        const { ethAmount, ethAmountScaled } = poolGetEthAmountFromJoinData(data, this.wethAddress);

        const batchSwapStep = processedSteps.find((step) => step.type === 'BatchSwap') as
            | ComposablePoolJoinProcessedBatchSwapStep
            | undefined;
        const processedJoinSteps = processedSteps.filter(
            (step) => step.type === 'Join',
        ) as ComposablePoolJoinProcessedJoinPoolStep[];

        if (batchSwapStep) {
            calls.push(
                this.batchRelayerService.encodeBatchSwapWithLimits({
                    ...batchSwapStep,
                    tokensIn: batchSwapStep.tokenAmountsIn.map((amountIn) => amountIn.address),
                    tokensOut: batchSwapStep.tokenAmountsOut.map((amountOut) => amountOut.address),
                    sender: data.userAddress,
                    recipient: data.userAddress,
                    ethAmountScaled,
                    //TODO: do we need to worry about slippage here? only real concern is the rate provider ticking up
                    slippage: '0.0001',
                    fromInternalBalance: false,
                    toInternalBalance: true,
                }),
            );
        }

        const assets = batchSwapStep?.assets || [];
        const deltas = batchSwapStep?.deltas || [];
        const numAssets = assets.length;

        for (let i = 0; i < processedJoinSteps.length; i++) {
            const step = processedJoinSteps[i];
            const isNestedJoin = i < processedJoinSteps.length - 1;

            calls.push(
                this.encodeJoinPool({
                    step,
                    batchSwapStep: batchSwapStep || null,
                    ethAmountScaled,
                    userAddress: data.userAddress,
                    wethIsEth: data.wethIsEth,
                    isNestedJoin,
                    outputReference: numAssets + i,
                    assets,
                    deltas,
                    slippage: data.slippage,
                }),
            );

            assets.push(step.pool.address);
            deltas.push(parseUnits(step.minBptReceived, 18).toString());
        }

        const poolBptOutputRef =
            processedJoinSteps.length > 0
                ? //if there is at least one join, the output ref of the bpt is 0
                  this.batchRelayerService.toChainedReference(0)
                : //use the index of the bpt address in the assets array
                  this.batchRelayerService.toChainedReference(assets.indexOf(this.pool.address));

        if (data.zapIntoMasterchefFarm) {
            calls.push(
                this.batchRelayerService.masterChefEncodeDeposit({
                    //sender: this.batchRelayerService.batchRelayerAddress,
                    sender: data.userAddress,
                    recipient: data.userAddress,
                    token: this.pool.address,
                    pid: parseInt(this.pool.staking!.id),
                    amount: poolBptOutputRef,
                    outputReference: Zero,
                }),
            );
        } else if (data.zapIntoGauge) {
            calls.push(
                this.batchRelayerService.gaugeEncodeDeposit({
                    gauge: this.pool.staking!.id,
                    sender: data.userAddress,
                    recipient: data.userAddress,
                    amount: poolBptOutputRef,
                }),
            );
        }

        return {
            type: 'BatchRelayer',
            calls,
            ethValue: ethAmountScaled,
        };
    }

    private async joinStepGetJoinPool({
        tokenAmountsIn,
        joinStep,
    }: {
        tokenAmountsIn: TokenAmountHumanReadable[];
        joinStep: ComposablePoolJoinPoolStep;
    }): Promise<ComposablePoolJoinProcessedJoinPoolStep> {
        const pool = joinStep.pool;
        const bptAmount =
            pool.__typename === 'GqlPoolWeighted'
                ? poolWeightedExactTokensInForBPTOut(tokenAmountsIn, pool)
                : poolStableExactTokensInForBPTOut(tokenAmountsIn, pool);
        const bptZeroPriceImpact =
            pool.__typename === 'GqlPoolWeighted'
                ? poolWeightedBptForTokensZeroPriceImpact(tokenAmountsIn, pool)
                : poolStableBptForTokensZeroPriceImpact(tokenAmountsIn, pool);

        return {
            type: 'Join',
            priceImpact: bptZeroPriceImpact.lt(bptAmount)
                ? 0
                : oldBnum(1).minus(bptAmount.div(bptZeroPriceImpact)).toNumber(),
            minBptReceived: formatFixed(bptAmount.toString(), 18),
            tokenAmountsIn,
            pool,
        };
    }

    private async joinStepGetJoinBatchSwap({
        pool,
        tokenAmountsIn,
        batchSwapStep,
        provider,
    }: {
        pool: PoolWithPossibleNesting;
        tokenAmountsIn: TokenAmountHumanReadable[];
        batchSwapStep: ComposablePoolJoinBatchSwapStep;
        provider: BaseProvider;
    }): Promise<ComposablePoolJoinProcessedBatchSwapStep> {
        const joinSwaps: { swap: SwapV2; assets: string[] }[] = [];

        for (const tokenAmountIn of tokenAmountsIn) {
            const swapData = batchSwapStep.swaps.find((swap) => swap.tokenIn === tokenAmountIn.address);

            if (swapData) {
                const tokenIn = pool.allTokens.find((token) => token.address === tokenAmountIn.address);

                joinSwaps.push({
                    swap: {
                        poolId: swapData.poolId,
                        assetInIndex: 0,
                        assetOutIndex: 1,
                        amount: parseFixed(tokenAmountIn.amount, tokenIn?.decimals || 18).toString(),
                        userData: '0x',
                    },
                    assets: [swapData.tokenIn, swapData.tokenOut],
                });
            }
        }

        const { swaps, assets } = poolBatchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => [item.swap]),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider,
        });

        const tokenAmountsOut = batchSwapStep.swaps
            .map((swap) => {
                const token = pool.allTokens.find((token) => token.address === swap.tokenOut);
                const tokenOutIdx = assets.findIndex((asset) => asset === swap.tokenOut);

                return {
                    address: swap.tokenOut,
                    amount: formatFixed(BigNumber.from(deltas[tokenOutIdx] || '0').abs(), token?.decimals || 18),
                };
            })
            .filter((tokenAmount) => parseFloat(tokenAmount.amount) > 0);

        return { type: 'BatchSwap', swaps, assets, deltas, tokenAmountsIn, tokenAmountsOut };
    }

    private encodeJoinPool({
        step,
        batchSwapStep,
        userAddress,
        wethIsEth,
        ethAmountScaled,
        isNestedJoin,
        outputReference,
        assets,
        deltas,
        slippage,
    }: {
        step: ComposablePoolJoinProcessedJoinPoolStep;
        batchSwapStep: ComposablePoolJoinProcessedBatchSwapStep | null;
        userAddress: string;
        wethIsEth: boolean;
        ethAmountScaled: AmountScaledString;
        isNestedJoin: boolean;
        outputReference: number;
        assets: string[];
        deltas: AmountScaledString[];
        slippage: AmountHumanReadable;
    }): string {
        const pool = step.pool;
        const joinHasNativeAsset = wethIsEth && pool.tokens.find((token) => token.address === this.wethAddress);
        const tokensWithPhantomBpt =
            pool.__typename === 'GqlPoolWeighted'
                ? sortBy(pool.tokens, 'index')
                : sortBy([...pool.tokens, { address: pool.address, decimals: 18, __typename: 'pool' }], 'address');
        const bptIdx = tokensWithPhantomBpt.findIndex((token) => token.address === pool.address);

        const amountsIn = tokensWithPhantomBpt.map((token) => {
            if (token.address === pool.address) {
                return Zero.toString();
            }

            const tokenAmountIn = step.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === token.address);

            if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
                //This token is a nested BPT, not a mainToken
                //Replace the amount with the chained reference value
                const index = assets.findIndex((asset) => asset.toLowerCase() === token.address) || -1;

                //if the return amount is 0, we dont pass on the chained reference
                if (index === -1 || deltas[index] === '0') {
                    return '0';
                }

                return this.batchRelayerService.toChainedReference(index);
            }

            return parseUnits(tokenAmountIn?.amount || '0', token.decimals).toString();
        });

        return this.batchRelayerService.vaultEncodeJoinPool({
            poolId: pool.id,
            poolKind: 0,
            sender: userAddress,
            //recipient: isNestedJoin ? batchRelayerService.batchRelayerAddress : userAddress,
            recipient: userAddress,
            joinPoolRequest: {
                assets: tokensWithPhantomBpt.map((token) => token.address),
                maxAmountsIn: amountsIn,
                userData: StablePoolEncoder.joinExactTokensInForBPTOut(
                    //required that that bpt idx is not included here
                    amountsIn.filter((amount, idx) => idx !== bptIdx),
                    parseUnits(oldBnumSubtractSlippage(step.minBptReceived, 18, slippage), 18),
                ),
                fromInternalBalance: batchSwapStep !== null,
            },
            value: joinHasNativeAsset ? ethAmountScaled : Zero,
            outputReference: isNestedJoin
                ? this.batchRelayerService.toChainedReference(outputReference)
                : this.batchRelayerService.toChainedReference(0),
        });
    }
}
