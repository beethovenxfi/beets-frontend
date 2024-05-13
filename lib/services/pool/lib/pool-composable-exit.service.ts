import {
    BatchRelayerPoolKind,
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
    poolGetNestedStablePoolTokens,
    poolGetNestedTokenEstimateForPoolTokenAmounts,
    poolGetPoolTokenForPossiblyNestedTokenOut,
    poolGetProportionalExitAmountsForBptIn,
    poolGetTotalShares,
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
    GqlPoolComposableStable,
    GqlPoolComposableStableNested,
    GqlPoolToken,
    GqlPoolTokenComposableStable,
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
            //for exact out, we need to reverse the swaps
            const swaps = reverse(cloneDeep(singleAssetExit.exitSwaps.swaps));
            const assets = cloneDeep(singleAssetExit.exitSwaps.assets);

            swaps[0].amount = parseUnits(tokenAmount.amount, tokenOut.decimals).toString();

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
            const assetOutIdx = singleAssetExit.exitSwaps.assets.indexOf(tokenOutAddress);

            const { deltas, swaps, assets, tokenAmountOut } = await this.getSingleAssetExitSwaps({
                exit: singleAssetExit,
                tokenOutAddress,
                amountIn,
            });

            //Inject the user accepted amount out.
            deltas[assetOutIdx] = `-${parseUnits(amountOut, singleAssetExit.tokenOut.decimals).toString()}`;

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
                    recipient: userAddress,
                    skipOutputRefs: false,
                }),
            );
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

        // only for the Composable V1 do we apply slippage on the bpt amount to allow a delta for the estimation
        const exitAmounts = poolGetProportionalExitAmountsForBptIn(
            this.isComposableV1(this.pool) ? oldBnumSubtractSlippage(bptAmountIn, 18, slippage) : bptAmountIn,
            this.pool.tokens,
            poolGetTotalShares(this.pool),
            this.isStablePool,
        );

        let bptAmounts = exitAmounts.filter(
            (amountOut) =>
                this.pool.tokens.find((token) => token.__typename === 'GqlPoolToken')?.address === amountOut.address ||
                !tokensOut.includes(amountOut.address),
        );

        let references = this.pool.tokens.map((token, index) => ({
            index: token.index,
            key: this.batchRelayerService.toChainedReference(index),
            address: token.address,
            refIdx: index,
        }));

        calls.push(
            this.batchRelayerService.vaultEncodeExitPool({
                poolId: this.pool.id,
                poolKind: this.getPoolKind(this.pool),
                sender: userAddress,
                recipient: userAddress,
                exitPoolRequest: this.getExitPoolRequest({
                    pool: this.pool,
                    bptIn: bptAmountIn,
                    exitAmounts,
                    finalTokenAmountsOut: amountsOut,
                    slippage,
                    toInternalBalance: false,
                    inputReference: null,
                }),
                outputReferences: references,
            }),
        );

        for (const nestedStablePoolToken of this.nestedStablePoolTokens) {
            const nestedStablePool = nestedStablePoolToken.pool;
            //assuming a proportional exit, there should always be an amount for this
            const bptAmount = bptAmounts.find((amount) => amount.address === nestedStablePoolToken.address)!;

            // only for the Composable V1 do we apply slippage on the bpt amount to allow a delta for the estimation
            const nestedExitAmounts = poolGetProportionalExitAmountsForBptIn(
                this.isComposableV1(nestedStablePool)
                    ? oldBnumSubtractSlippage(bptAmount.amount, 18, slippage)
                    : bptAmount.amount,
                // workaround to filter out nested bpt again
                nestedStablePool.tokens.filter((token) => token.address !== nestedStablePool.address),
                poolGetTotalShares(nestedStablePool),
                true,
            );

            const firstIdx = references[references.length - 1].refIdx + 1;
            const outputReferences = nestedStablePool.tokens
                // workaround to filter out nested bpt again
                .filter((token) => token.address !== nestedStablePool.address)
                .map((token, index) => ({
                    index: token.index,
                    key: this.batchRelayerService.toChainedReference(firstIdx + index),
                    address: token.address,
                    refIdx: firstIdx + index,
                }));

            calls.push(
                this.batchRelayerService.vaultEncodeExitPool({
                    poolId: nestedStablePool.id,
                    poolKind: this.getPoolKind(nestedStablePool),
                    sender: userAddress,
                    recipient: userAddress,
                    exitPoolRequest: this.getExitPoolRequest({
                        pool: nestedStablePool,
                        bptIn: bptAmount.amount,
                        exitAmounts: nestedExitAmounts,
                        finalTokenAmountsOut: amountsOut,
                        slippage,
                        toInternalBalance: false,
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

        return {
            type: 'BatchRelayer',
            calls,
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
        const exitSwapPool = this.isStablePool ? this.pool : 'pool' in poolToken ? poolToken.pool : null;
        const exitSwapPoolToken = exitSwapPool
            ? poolGetPoolTokenForPossiblyNestedTokenOut(exitSwapPool, tokenOption.address)
            : undefined;

        return {
            tokenOut,
            poolToken,
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
        pool: GqlPoolWeighted | GqlPoolComposableStable | GqlPoolComposableStableNested;
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

    private get nestedStablePoolTokens(): GqlPoolTokenComposableStable[] {
        return poolGetNestedStablePoolTokens(this.pool);
    }

    private get isStablePool(): boolean {
        return this.pool.__typename === 'GqlPoolComposableStable';
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

    private isComposableV1(pool: GqlPoolWeighted | GqlPoolComposableStable | GqlPoolComposableStableNested): boolean {
        return (
            (pool.__typename === 'GqlPoolComposableStable' || pool.__typename === 'GqlPoolComposableStableNested') &&
            pool.version === 1
        );
    }

    private getPoolKind(pool: GqlPoolWeighted | GqlPoolComposableStable | GqlPoolComposableStableNested) {
        if (this.isComposableV1(pool)) {
            return BatchRelayerPoolKind.COMPOSABLE_STABLE;
        } else if (
            (pool.__typename === 'GqlPoolComposableStable' || pool.__typename === 'GqlPoolComposableStableNested') &&
            pool.version >= 2
        ) {
            return BatchRelayerPoolKind.COMPOSABLE_STABLE_V2;
        } else {
            return BatchRelayerPoolKind.WEIGHTED;
        }
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
        pool: GqlPoolWeighted | GqlPoolComposableStable | GqlPoolComposableStableNested;
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
        const tokensWithoutPhantomBpt = pool.tokens.filter((token) => token.address !== pool.address);
        const tokensWithPhantomBpt =
            pool.__typename === 'GqlPoolWeighted'
                ? sortBy(pool.tokens, 'index')
                : sortBy(
                      [...tokensWithoutPhantomBpt, { address: pool.address, decimals: 18, __typename: 'pool' }],
                      'address',
                  );

        // only for Composable V1: this approach is not entirely ideal, as it will leave the user with dust in their wallet when they fully exit,
        const amountsOutScaled = sortBy(pool.tokens, 'index').map((poolToken) => {
            const exitAmount = exitAmounts.find((exitAmount) => poolToken.address === exitAmount.address);

            return parseUnits(exitAmount?.amount || '0', poolToken.decimals).toString();
        });

        // this is for all other pool types: apply some slippage so we stay below the limits
        const minAmountsOut = exitAmounts.map((exitAmount) => {
            const token = pool.tokens.find((token) => token.address === exitAmount.address);
            const amountScaled = oldBnumScaleAmount(exitAmount.amount, token?.decimals);

            return amountScaled.minus(amountScaled.times(slippage)).toFixed(0);
        });

        if (pool.__typename === 'GqlPoolComposableStable' || pool.__typename === 'GqlPoolComposableStableNested') {
            const idx = tokensWithPhantomBpt.findIndex((token) => token.address === pool.address);
            minAmountsOut.splice(idx, 0, '0');
        }

        return {
            assets: tokensWithPhantomBpt.map((token) => token.address),
            minAmountsOut: this.isComposableV1(pool) ? tokensWithPhantomBpt.map(() => '0') : minAmountsOut,
            userData: this.isComposableV1(pool)
                ? defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [1, amountsOutScaled, maxBptIn])
                : pool.__typename === 'GqlPoolWeighted'
                ? WeightedPoolEncoder.exitExactBPTInForTokensOut(maxBptIn)
                : //TODO: move this to the composable stable encoder once its merged in
                  defaultAbiCoder.encode(['uint256', 'uint256'], [2, maxBptIn]),
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
        mainTokenAmountOut: AmountHumanReadable;
        tokenAmountOut: AmountHumanReadable;
        swaps: SwapV2[];
        assets: string[];
    }> {
        const swaps = cloneDeep(exit.exitSwaps?.swaps || []);
        const assets = cloneDeep(exit.exitSwaps?.assets || []);
        const assetOutIdx = assets.indexOf(tokenOutAddress);
        let deltas: string[] = [];

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
        } catch (error) {
            console.log(error);
        }

        const swapTokenOut = exit.tokenOut;
        const wrappedTokenPriceRate = '1.0';

        const tokenAmountOut = formatFixed(BigNumber.from(deltas[assetOutIdx] || '0').abs(), swapTokenOut.decimals);
        const mainTokenAmountOut = formatFixed(
            oldBnum(deltas[assetOutIdx] || '0')
                .abs()
                .toFixed(0),
            exit.tokenOut.decimals,
        );

        return { deltas, tokenAmountOut, mainTokenAmountOut, swaps, assets };
    }
}
