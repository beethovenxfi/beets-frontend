import {
    ComposablePoolExitNestedLinearPool,
    ComposablePoolSingleAssetExit,
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitExactBPTInForOneTokenOut,
    PoolExitExactBPTInForTokensOut,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolWithPossibleNesting,
} from '~/lib/services/pool/pool-types';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import {
    poolBatchSwaps,
    poolGetMainTokenFromLinearPoolToken,
    poolGetNestedLinearPoolTokens,
    poolGetNestedStablePoolTokens,
    poolGetNestedTokenEstimateForPoolTokenAmounts,
    poolGetPoolTokenForPossiblyNestedTokenOut,
    poolGetProportionalExitAmountsForBptIn,
    poolGetTotalShares,
    poolGetWrappedTokenFromLinearPoolToken,
    poolHasOnlyLinearBpts,
    poolQueryBatchSwap,
    poolStableBptForTokensZeroPriceImpact,
    poolStableExactBPTInForTokenOut,
    poolWeightedBptForTokensZeroPriceImpact,
    poolWeightedBptInForExactTokenOut,
    poolWeightedExactBPTInForTokenOut,
} from '~/lib/services/pool/lib/util';
import { BaseProvider } from '@ethersproject/providers';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { ExitPoolRequest, SwapTypes, SwapV2, WeightedPoolEncoder } from '@balancer-labs/sdk';
import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScaleAmount,
    oldBnumSubtractSlippage,
} from '~/lib/services/pool/lib/old-big-number';
import { parseUnits } from 'ethers/lib/utils';
import {
    GqlPoolPhantomStable,
    GqlPoolPhantomStableNested,
    GqlPoolToken,
    GqlPoolTokenLinear,
    GqlPoolTokenPhantomStable,
    GqlPoolTokenUnion,
    GqlPoolWeighted,
    GqlPoolWithdrawOption,
} from '~/apollo/generated/graphql-codegen-generated';
import { cloneDeep, reverse, sortBy } from 'lodash';
import { poolGetExitSwaps } from '~/lib/services/pool/pool-phantom-stable-util';
import { defaultAbiCoder } from '@ethersproject/abi';
import { Zero } from '@ethersproject/constants';
import { networkConfig } from '~/lib/config/network-config';

export class PoolComposableExitService {
    private readonly singleAssetExits: ComposablePoolSingleAssetExit[] = [];

    constructor(
        private pool: PoolWithPossibleNesting,
        private readonly batchRelayerService: BatchRelayerService,
        private readonly provider: BaseProvider,
        private readonly wethAddress: string,
    ) {
        for (const option of this.pool.withdrawConfig.options) {
            for (const tokenOption of option.tokenOptions) {
                this.singleAssetExits.push(this.buildSingleAssetExit({ option, tokenOption }));
            }
        }
    }

    public updatePool(pool: PoolWithPossibleNesting) {
        this.pool = pool;
    }

    public async exitGetProportionalPoolTokenWithdrawEstimate(bptIn: AmountHumanReadable) {
        return poolGetProportionalExitAmountsForBptIn(
            bptIn,
            this.pool.tokens,
            poolGetTotalShares(this.pool),
            this.isStablePool,
        );
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        const exitAmounts = poolGetProportionalExitAmountsForBptIn(
            bptIn,
            this.pool.tokens,
            poolGetTotalShares(this.pool),
            this.isStablePool,
        );

        return poolGetNestedTokenEstimateForPoolTokenAmounts({
            pool: this.pool,
            nestedTokens: tokensOut,
            poolTokenAmounts: exitAmounts,
        });
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        const singleAssetExit = this.getSingleAssetExitForTokenOut(tokenOutAddress);
        let amountIn: AmountHumanReadable = bptIn;
        let amountOut: AmountHumanReadable = '0';

        const { tokenAmountOut, priceImpact } = this.getAmountOutForBptIn({
            bptIn,
            pool: this.pool,
            poolToken: singleAssetExit.poolToken,
        });

        if (this.isWeightedPool) {
            amountIn = tokenAmountOut;
            amountOut = tokenAmountOut;
        }

        if (singleAssetExit.exitSwaps) {
            const { mainTokenAmountOut } = await this.getSingleAssetExitSwaps({
                exit: singleAssetExit,
                tokenOutAddress,
                amountIn,
            });

            amountOut = mainTokenAmountOut;
        }

        return {
            priceImpact,
            tokenAmount: amountOut,
            //TODO: calculate nested price impacts
            nestedPriceImpacts: [],
        };
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        const singleAssetExit = this.getSingleAssetExitForTokenOut(tokenAmount.address);
        const poolToken = singleAssetExit.poolToken;
        const tokenOut = singleAssetExit.tokenOut;
        let bptIn: AmountHumanReadable = '0';

        if (singleAssetExit.exitSwaps) {
            const requiresUnwrap =
                singleAssetExit.linearPool &&
                parseFloat(tokenAmount.amount) > parseFloat(singleAssetExit.linearPool.mainToken.totalBalance);

            //for exact out, we need to reverse the swaps
            const swaps = reverse(cloneDeep(singleAssetExit.exitSwaps.swaps));
            const assets = cloneDeep(singleAssetExit.exitSwaps.assets);

            if (requiresUnwrap && singleAssetExit.linearPool) {
                const wrappedToken = singleAssetExit.linearPool.wrappedToken;
                const wrappedTokenAmount: AmountHumanReadable = formatFixed(
                    oldBnumScaleAmount(tokenAmount.amount, tokenOut.decimals).div(wrappedToken.priceRate).toFixed(0),
                    tokenOut.decimals,
                );

                assets[assets.length - 1] = wrappedToken.address;
                swaps[0].amount = parseUnits(wrappedTokenAmount, wrappedToken.decimals).toString();
            } else {
                swaps[0].amount = parseUnits(tokenAmount.amount, tokenOut.decimals).toString();
            }

            const deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets,
                swapType: SwapTypes.SwapExactOut,
            });

            bptIn = formatFixed(BigNumber.from(deltas[0] || '0').abs(), 18);
        }

        if (this.pool.__typename === 'GqlPoolWeighted') {
            if (poolToken.address === tokenAmount.address) {
                bptIn = poolWeightedBptInForExactTokenOut(this.pool, {
                    address: poolToken.address,
                    amount: tokenAmount.amount,
                });
            } else {
                bptIn = poolWeightedBptInForExactTokenOut(this.pool, {
                    address: poolToken.address,
                    amount: bptIn,
                });
            }
        }

        const { priceImpact } = this.getAmountOutForBptIn({
            bptIn,
            pool: this.pool,
            poolToken: singleAssetExit.poolToken,
        });

        return {
            bptIn,
            priceImpact,
        };
    }

    public async exitExactBPTInForOneTokenOutGetContractCallData(
        data: PoolExitExactBPTInForOneTokenOut,
    ): Promise<PoolExitContractCallData> {
        const { bptAmountIn, tokenOutAddress, amountOut, userAddress, slippage } = data;
        const singleAssetExit = this.getSingleAssetExitForTokenOut(tokenOutAddress);
        const poolToken = singleAssetExit.poolToken;
        const calls: string[] = [];
        let amountIn: AmountHumanReadable = bptAmountIn;

        if (this.isWeightedPool) {
            const { tokenAmountOut } = this.getAmountOutForBptIn({
                bptIn: bptAmountIn,
                pool: this.pool,
                poolToken,
            });

            //if there are no exit swaps, then we use the passed in amountOut
            const minAmountOut = parseUnits(
                oldBnumSubtractSlippage(
                    singleAssetExit.exitSwaps ? tokenAmountOut : amountOut,
                    poolToken.decimals,
                    slippage,
                ),
                poolToken.decimals,
            ).toString();

            const exitCall = this.batchRelayerService.vaultConstructExitCall({
                poolId: this.pool.id,
                poolKind: 0,
                assets: this.pool.tokens.map((token) => token.address),
                minAmountsOut: this.pool.tokens.map((token) =>
                    token.address === poolToken.address ? minAmountOut : '0',
                ),
                userData: WeightedPoolEncoder.exitExactBPTInForOneTokenOut(
                    parseUnits(bptAmountIn, 18),
                    poolToken.index,
                ),
                sender: userAddress,
                recipient: userAddress,
                outputReferences: this.pool.tokens.map((token) => ({
                    index: token.index,
                    key: this.batchRelayerService.toChainedReference(token.index),
                })),
                toInternalBalance: !!singleAssetExit.exitSwaps,
            });

            calls.push(exitCall);
            amountIn = tokenAmountOut;
        }

        if (singleAssetExit.exitSwaps) {
            const wrappedToken = singleAssetExit.linearPool?.wrappedToken;
            const assetOutIdx = singleAssetExit.exitSwaps.assets.indexOf(tokenOutAddress);

            const { deltas, requiresUnwrap, swaps, assets, tokenAmountOut } = await this.getSingleAssetExitSwaps({
                exit: singleAssetExit,
                tokenOutAddress,
                amountIn,
            });

            if (!requiresUnwrap) {
                //Inject the user accepted amount out.
                deltas[assetOutIdx] = `-${parseUnits(amountOut, singleAssetExit.tokenOut.decimals).toString()}`;
            } else {
                //TODO: scale on price rate
            }

            if (this.isWeightedPool) {
                swaps[0].amount = this.batchRelayerService.toChainedReference(poolToken.index).toString();

                const amountScaled = oldBnum(deltas[0]);
                deltas[0] = amountScaled.plus(amountScaled.times(slippage)).toFixed(0);
            }

            calls.push(
                this.batchRelayerService.encodeBatchSwapWithLimits({
                    tokensIn: [assets[0]],
                    tokensOut: [assets[assetOutIdx]],
                    swaps,
                    assets,
                    deltas,
                    ethAmountScaled: '0',
                    slippage,
                    fromInternalBalance: this.isWeightedPool,
                    toInternalBalance: false,
                    sender: userAddress,
                    recipient:
                        requiresUnwrap && singleAssetExit.linearPool
                            ? this.batchRelayerService.batchRelayerAddress
                            : userAddress,
                    skipOutputRefs: !(requiresUnwrap && singleAssetExit.linearPool),
                }),
            );

            if (requiresUnwrap && singleAssetExit.linearPool) {
                const wrappedToken = singleAssetExit.linearPool.wrappedToken;
                const assetOutIdx = assets.length - 1;
                const factory = singleAssetExit.linearPool.linearPoolToken.pool.factory || '';

                calls.push(
                    this.batchRelayerService.getUnwrapCallForLinearPoolWithFactory({
                        factory,
                        wrappedToken: wrappedToken.address,
                        sender: this.batchRelayerService.batchRelayerAddress,
                        recipient: userAddress,
                        amount: this.batchRelayerService.toChainedReference(assetOutIdx),
                        outputReference: Zero,
                    }),
                );
            }
        }

        return {
            type: 'BatchRelayer',
            calls,
        };
    }

    public async exitExactBPTInForTokensOutGetContractCallData(
        data: PoolExitExactBPTInForTokensOut,
    ): Promise<PoolExitContractCallData> {
        const calls: string[] = [];
        const { amountsOut, userAddress, bptAmountIn, slippage } = data;
        const tokensOut = amountsOut.map((amountOut) => amountOut.address);

        //we apply the slippage on the bpt amount to allow a delta for the estimation
        const exitAmounts = poolGetProportionalExitAmountsForBptIn(
            oldBnumSubtractSlippage(bptAmountIn, 18, data.slippage),
            this.pool.tokens,
            poolGetTotalShares(this.pool),
            this.isStablePool,
        );

        let bptAmounts = exitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address));

        let references = this.pool.tokens.map((token, index) => ({
            index: token.index,
            key: this.batchRelayerService.toChainedReference(index),
            address: token.address,
            refIdx: index,
        }));

        calls.push(
            this.batchRelayerService.vaultEncodeExitPool({
                poolId: this.pool.id,
                poolKind: 0,
                sender: userAddress,
                recipient: userAddress,
                exitPoolRequest: this.getExitPoolRequest({
                    pool: this.pool,
                    bptIn: bptAmountIn,
                    exitAmounts,
                    finalTokenAmountsOut: amountsOut,
                    slippage,
                    toInternalBalance: poolHasOnlyLinearBpts(this.pool),
                    inputReference: null,
                }),
                outputReferences: references,
            }),
        );

        for (const nestedStablePoolToken of this.nestedStablePoolTokens) {
            const nestedStablePool = nestedStablePoolToken.pool;
            //assuming a proportional exit, there should always be an amount for this
            const bptAmount = bptAmounts.find((amount) => amount.address === nestedStablePoolToken.address)!;

            //we apply the slippage on the bpt amount to allow a delta for the estimation
            const nestedExitAmounts = poolGetProportionalExitAmountsForBptIn(
                oldBnumSubtractSlippage(bptAmount.amount, 18, data.slippage),
                nestedStablePool.tokens,
                poolGetTotalShares(nestedStablePool),
                true,
            );

            const firstIdx = references[references.length - 1].refIdx + 1;
            const outputReferences = nestedStablePool.tokens.map((token, index) => ({
                index: token.index,
                key: this.batchRelayerService.toChainedReference(firstIdx + index),
                address: token.address,
                refIdx: firstIdx + index,
            }));

            calls.push(
                this.batchRelayerService.vaultEncodeExitPool({
                    poolId: nestedStablePool.id,
                    poolKind: 0,
                    sender: userAddress,
                    recipient: userAddress,
                    exitPoolRequest: this.getExitPoolRequest({
                        pool: nestedStablePool,
                        bptIn: bptAmount.amount,
                        exitAmounts: nestedExitAmounts,
                        finalTokenAmountsOut: amountsOut,
                        slippage,
                        toInternalBalance: poolHasOnlyLinearBpts(nestedStablePool),
                        inputReference:
                            references.find((ref) => ref.address === nestedStablePoolToken.address)?.index || null,
                    }),
                    outputReferences,
                }),
            );

            bptAmounts = bptAmounts.concat(
                nestedExitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address)),
            );
            references = [...references, ...outputReferences];
        }

        const nestedLinearPools = this.nestedLinearPoolTokens.map((linearPoolToken) => ({
            linearPoolToken,
            mainToken: poolGetMainTokenFromLinearPoolToken(linearPoolToken),
            wrappedToken: poolGetWrappedTokenFromLinearPoolToken(linearPoolToken),
        }));

        if (nestedLinearPools.length > 0) {
            const { swaps, assets, deltas, requiresUnwrap } = await this.getExitSwapsForNestedLinearPools(
                bptAmounts,
                nestedLinearPools,
            );

            //replace amounts with input references
            for (const swap of swaps) {
                const ref = references.find((ref) => ref.address === assets[swap.assetInIndex]);

                if (ref) {
                    swap.amount = ref.key.toString();
                }
            }

            calls.push(
                this.batchRelayerService.encodeBatchSwapWithLimits({
                    tokensIn: nestedLinearPools.map((linearPool) => linearPool.linearPoolToken.address),
                    tokensOut: nestedLinearPools.map((linearPool) =>
                        requiresUnwrap ? linearPool.wrappedToken.address : linearPool.mainToken.address,
                    ),
                    deltas,
                    assets,
                    swaps,
                    ethAmountScaled: '0',
                    sender: userAddress,
                    recipient: requiresUnwrap ? this.batchRelayerService.batchRelayerAddress : userAddress,
                    slippage,
                    fromInternalBalance: true,
                    toInternalBalance: false,
                }),
            );

            if (requiresUnwrap) {
                for (const nestedLinearPool of nestedLinearPools) {
                    const factory = nestedLinearPool.linearPoolToken.pool.factory || '';
                    const assetIdx = assets.indexOf(nestedLinearPool.wrappedToken.address);

                    calls.push(
                        this.batchRelayerService.getUnwrapCallForLinearPoolWithFactory({
                            factory,
                            wrappedToken: nestedLinearPool.wrappedToken.address,
                            sender: this.batchRelayerService.batchRelayerAddress,
                            recipient: userAddress,
                            amount: this.batchRelayerService.toChainedReference(assetIdx),
                            outputReference: Zero,
                        }),
                    );
                }
            }
        }

        return {
            type: 'BatchRelayer',
            calls,
        };
    }

    private async getExitSwapsForNestedLinearPools(
        bptAmountsIn: TokenAmountHumanReadable[],
        nestedLinearPools: ComposablePoolExitNestedLinearPool[],
    ): Promise<{
        swaps: SwapV2[];
        deltas: string[];
        assets: string[];
        //tokenAmountsOut: TokenAmountHumanReadable[];
        //mainTokenAmountsOut: TokenAmountHumanReadable[];
        requiresUnwrap: boolean;
    }> {
        const exitSwaps: { swap: SwapV2; assets: string[]; nestedLinearPool: ComposablePoolExitNestedLinearPool }[] =
            [];
        const requiresUnwrap = !!nestedLinearPools.find(({ linearPoolToken, mainToken }) => {
            const bptAmount = bptAmountsIn.find((amount) => amount.address === linearPoolToken.address);

            return (
                parseFloat(mainToken.totalBalance) <
                parseFloat(bptAmount?.amount || '0') * parseFloat(linearPoolToken.pool.bptPriceRate)
            );
        });

        for (const nestedLinearPool of nestedLinearPools) {
            const { linearPoolToken, mainToken, wrappedToken } = nestedLinearPool;
            const bptAmount = bptAmountsIn.find((amount) => amount.address === linearPoolToken.address);

            if (bptAmount) {
                exitSwaps.push({
                    swap: {
                        poolId: linearPoolToken.pool.id,
                        assetInIndex: 0,
                        assetOutIndex: 1,
                        /*amount:
                            exitAssetIndex !== -1
                                ? this.batchRelayerService.toChainedReference(exitAssetIndex).toString()
                                : parseFixed(bptAmount?.amount || '0', 18).toString(),*/
                        amount: parseFixed(bptAmount?.amount || '0', 18).toString(),
                        userData: '0x',
                    },
                    assets: [linearPoolToken.address, requiresUnwrap ? wrappedToken.address : mainToken.address],
                    nestedLinearPool,
                });
            }
        }

        const { swaps, assets } = poolBatchSwaps(
            exitSwaps.map((item) => item.assets),
            exitSwaps.map((item) => [item.swap]),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider: this.provider,
        });

        /*const tokenAmountsOut = exitSwaps.map((exitSwap) => {
            const tokenOut = exitSwap.assets[1];
            const tokenOutIdx = assets.indexOf(tokenOut);
            const token =
                tokenOut === exitSwap.nestedLinearPool.mainToken.address
                    ? exitSwap.nestedLinearPool.mainToken
                    : exitSwap.nestedLinearPool.wrappedToken;

            return {
                address: tokenOut,
                amount: formatFixed(BigNumber.from(deltas[tokenOutIdx] || '0').abs(), token.decimals),
            };
        });

        const mainTokenAmountsOut = exitSwaps.map((exitSwap) => {
            const tokenOut = exitSwap.assets[1];
            const tokenOutIdx = assets.indexOf(tokenOut);
            const mainToken = exitSwap.nestedLinearPool.mainToken;
            const wrappedToken = exitSwap.nestedLinearPool.wrappedToken;
            const isMainToken = tokenOut === mainToken.address;
            const token = isMainToken ? mainToken : wrappedToken;

            return {
                address: tokenOut,
                amount: formatFixed(
                    oldBnum(deltas[tokenOutIdx] || '0')
                        .abs()
                        .times(isMainToken ? '1' : wrappedToken.priceRate)
                        .toFixed(0),
                    token.decimals,
                ),
            };
        });*/

        return {
            swaps,
            deltas,
            assets,
            //tokenAmountsOut,
            //mainTokenAmountsOut,
            requiresUnwrap,
        };
    }

    private buildSingleAssetExit({
        option,
        tokenOption,
    }: {
        option: GqlPoolWithdrawOption;
        tokenOption: GqlPoolToken;
    }): ComposablePoolSingleAssetExit {
        const poolToken = this.pool.tokens.find((poolToken) => poolToken.address === option.poolTokenAddress)!;
        const tokenOut = this.pool.allTokens.find((token) => token.address === tokenOption.address)!;
        const linearPoolToken = this.nestedLinearPoolTokens.find((linearPoolToken) => {
            const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

            return mainToken.address === tokenOption.address;
        });

        const exitSwapPool = this.isStablePool ? this.pool : 'pool' in poolToken ? poolToken.pool : null;
        const exitSwapPoolToken = exitSwapPool
            ? poolGetPoolTokenForPossiblyNestedTokenOut(exitSwapPool, tokenOption.address)
            : undefined;

        return {
            tokenOut,
            poolToken,
            linearPool: linearPoolToken
                ? {
                      linearPoolToken,
                      mainToken: poolGetMainTokenFromLinearPoolToken(linearPoolToken),
                      wrappedToken: poolGetWrappedTokenFromLinearPoolToken(linearPoolToken),
                  }
                : undefined,
            exitSwaps:
                exitSwapPool && exitSwapPoolToken
                    ? poolGetExitSwaps({
                          poolId: exitSwapPool.id,
                          poolAddress: exitSwapPool.address,
                          tokenOut: tokenOption.address,
                          bptIn: '0',
                          poolToken: exitSwapPoolToken,
                      })
                    : undefined,
        };
    }

    private getAmountOutForBptIn({
        bptIn,
        pool,
        poolToken,
    }: {
        bptIn: AmountHumanReadable;
        pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested;
        poolToken: GqlPoolTokenUnion;
    }): {
        tokenAmountOut: AmountHumanReadable;
        priceImpact: number;
    } {
        const bptAmountScaled = oldBnumFromBnum(parseUnits(bptIn));

        const poolTokenAmountOut =
            pool.__typename === 'GqlPoolWeighted'
                ? poolWeightedExactBPTInForTokenOut(pool, bptIn, poolToken.address)
                : poolStableExactBPTInForTokenOut(pool, bptIn, poolToken.address);
        const tokenAmounts = [{ address: poolToken.address, amount: poolTokenAmountOut }];

        const bptZeroPriceImpact =
            pool.__typename === 'GqlPoolWeighted'
                ? poolWeightedBptForTokensZeroPriceImpact(tokenAmounts, pool)
                : poolStableBptForTokensZeroPriceImpact(tokenAmounts, pool);

        return {
            tokenAmountOut: poolTokenAmountOut,
            priceImpact: bptAmountScaled.lt(bptZeroPriceImpact)
                ? 0
                : bptAmountScaled.div(bptZeroPriceImpact).minus(1).toNumber(),
        };
    }

    private get nestedLinearPoolTokens(): GqlPoolTokenLinear[] {
        return poolGetNestedLinearPoolTokens(this.pool);
    }

    private get nestedStablePoolTokens(): GqlPoolTokenPhantomStable[] {
        return poolGetNestedStablePoolTokens(this.pool);
    }

    private get isStablePool(): boolean {
        return this.pool.__typename === 'GqlPoolPhantomStable';
    }

    private get isWeightedPool(): boolean {
        return this.pool.__typename === 'GqlPoolWeighted';
    }

    private getSingleAssetExitForTokenOut(tokenOutAddress: string): ComposablePoolSingleAssetExit {
        const singleAssetExit = this.singleAssetExits.find((exit) => exit.tokenOut.address === tokenOutAddress);

        if (!singleAssetExit) {
            throw new Error('No exit path for token out ' + tokenOutAddress);
        }

        return singleAssetExit;
    }

    private getExitPoolRequest({
        pool,
        bptIn,
        slippage,
        exitAmounts,
        finalTokenAmountsOut,
        toInternalBalance,
        inputReference,
    }: {
        pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested;
        bptIn: AmountHumanReadable;
        slippage: string;
        exitAmounts: TokenAmountHumanReadable[];
        finalTokenAmountsOut: TokenAmountHumanReadable[];
        toInternalBalance: boolean;
        inputReference: number | null;
    }): ExitPoolRequest {
        const maxBptIn =
            inputReference !== null
                ? this.batchRelayerService.toChainedReference(inputReference).toString()
                : parseUnits(bptIn, 18).toString();
        const tokensWithPhantomBpt =
            pool.__typename === 'GqlPoolWeighted'
                ? sortBy(pool.tokens, 'index')
                : sortBy([...pool.tokens, { address: pool.address, decimals: 18, __typename: 'pool' }], 'address');

        //TODO: this approach is not entirely ideal, as it will leave the user with dust in their wallet when they fully exit,
        //TODO: but a more complete solution will be much more involved, need to circle back to it
        const amountsOutScaled = sortBy(pool.tokens, 'index').map((poolToken) => {
            const exitAmount = exitAmounts.find((exitAmount) => poolToken.address === exitAmount.address);

            return parseUnits(exitAmount?.amount || '0', poolToken.decimals).toString();
        });

        return {
            assets: tokensWithPhantomBpt.map((token) => token.address),
            //minAmountsOut is not relevant for BPTInForExactTokensOut
            minAmountsOut: tokensWithPhantomBpt.map(() => '0'),
            userData:
                pool.__typename === 'GqlPoolWeighted'
                    ? WeightedPoolEncoder.exitBPTInForExactTokensOut(amountsOutScaled, maxBptIn)
                    : //TODO: move this to the composable stable encoder once its merged in
                      defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [1, amountsOutScaled, maxBptIn]),
            toInternalBalance,
        };
    }

    private async getSingleAssetExitSwaps({
        exit,
        tokenOutAddress,
        amountIn,
    }: {
        exit: ComposablePoolSingleAssetExit;
        amountIn: AmountHumanReadable;
        tokenOutAddress: string;
    }): Promise<{
        deltas: string[];
        requiresUnwrap: boolean;
        mainTokenAmountOut: AmountHumanReadable;
        tokenAmountOut: AmountHumanReadable;
        swaps: SwapV2[];
        assets: string[];
    }> {
        const swaps = cloneDeep(exit.exitSwaps?.swaps || []);
        const assets = cloneDeep(exit.exitSwaps?.assets || []);
        const assetOutIdx = assets.indexOf(tokenOutAddress);
        let deltas: string[] = [];
        let requiresUnwrap = false;

        swaps[0].amount = parseUnits(amountIn, 18).toString();

        //the most accurate way to determine if we need to unwrap is to attempt to exit with main token,
        //and if that fails, then attempt to exit with wrapped token.
        try {
            deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets,
                swapType: SwapTypes.SwapExactIn,
            });
        } catch (e) {
            if (!exit.linearPool) {
                //shouldn't ever really get here, the batch swap should only fail when there is inadequate main
                //token in the linear pool to facilitate the exit
                throw e;
            }

            assets[assetOutIdx] = exit.linearPool.wrappedToken.address;
            deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets,
                swapType: SwapTypes.SwapExactIn,
            });

            requiresUnwrap = true;
        }

        const swapTokenOut = requiresUnwrap && exit.linearPool ? exit.linearPool.wrappedToken : exit.tokenOut;
        const wrappedTokenPriceRate = exit.linearPool?.wrappedToken.priceRate || '1.0';

        const tokenAmountOut = formatFixed(BigNumber.from(deltas[assetOutIdx] || '0').abs(), swapTokenOut.decimals);
        const mainTokenAmountOut = formatFixed(
            oldBnum(deltas[assetOutIdx] || '0')
                .abs()
                .times(requiresUnwrap ? wrappedTokenPriceRate : '1.0')
                .toFixed(0),
            exit.tokenOut.decimals,
        );

        return { requiresUnwrap, deltas, tokenAmountOut, mainTokenAmountOut, swaps, assets };
    }
}
