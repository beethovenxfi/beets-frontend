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
    oldBnumScale,
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
import { MaxUint256 } from '@ethersproject/constants';
import { defaultAbiCoder } from '@ethersproject/abi';

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

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        const exitAmounts = poolGetProportionalExitAmountsForBptIn(
            bptIn,
            this.pool.tokens,
            poolGetTotalShares(this.pool),
        );

        let tokenAmountsOut = exitAmounts.filter((amountOut) => tokensOut.includes(amountOut.address));
        let bptAmounts = exitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address));

        for (const nestedStablePoolToken of this.nestedStablePoolTokens) {
            const nestedStablePool = nestedStablePoolToken.pool;
            //assuming a proportional exit, there should always be an amount for this
            const bptAmount = bptAmounts.find((amount) => amount.address === nestedStablePoolToken.address)!;

            const nestedExitAmounts = poolGetProportionalExitAmountsForBptIn(
                bptAmount.amount,
                nestedStablePool.tokens,
                poolGetTotalShares(nestedStablePool),
            );

            tokenAmountsOut = tokenAmountsOut.concat(
                nestedExitAmounts.filter((amountOut) => tokensOut.includes(amountOut.address)),
            );
            bptAmounts = bptAmounts.concat(
                nestedExitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address)),
            );
        }

        for (const linearPoolToken of this.nestedLinearPoolTokens) {
            const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);
            const bptAmount = bptAmounts.find((bptAmount) => bptAmount.address === linearPoolToken.address);

            if (bptAmount) {
                //TODO: this is an estimation, but should be adequate assuming rates are up to date
                tokenAmountsOut.push({
                    address: mainToken.address,
                    amount: formatFixed(
                        oldBnumScaleAmount(bptAmount.amount).times(linearPoolToken.priceRate).toFixed(0),
                        18,
                    ),
                });
            }
        }

        return tokenAmountsOut;
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        const singleAssetExit = this.getSingleAssetExitForTokenOut(tokenOutAddress);
        let amountIn: AmountHumanReadable = bptIn;
        let amountOut: AmountHumanReadable = '0';

        const { tokenAmountOut, priceImpact } = this.getAmountOutForBptIn({
            bptIn: amountIn,
            pool: this.pool,
            poolToken: singleAssetExit.poolToken,
        });

        if (this.isWeightedPool) {
            amountIn = tokenAmountOut;
            amountOut = tokenAmountOut;
        }

        if (singleAssetExit.exitSwaps) {
            const tokenOutIdx = singleAssetExit.exitSwaps.assets.indexOf(tokenOutAddress);
            const swaps = cloneDeep(singleAssetExit.exitSwaps.swaps);
            //amountIn is always a BPT
            swaps[0].amount = parseUnits(amountIn, 18).toString();

            const deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets: singleAssetExit.exitSwaps.assets,
                swapType: SwapTypes.SwapExactIn,
            });

            amountOut = formatFixed(
                BigNumber.from(deltas[tokenOutIdx] || '0').abs(),
                singleAssetExit.tokenOut.decimals,
            );
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
        let bptIn: AmountHumanReadable = '0';

        if (singleAssetExit.exitSwaps) {
            //for exact out, we need to reverse the swaps
            const swaps = reverse(cloneDeep(singleAssetExit.exitSwaps.swaps));
            swaps[0].amount = parseUnits(tokenAmount.amount, singleAssetExit.tokenOut.decimals).toString();

            const deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets: singleAssetExit.exitSwaps.assets,
                swapType: SwapTypes.SwapExactOut,
            });

            bptIn = formatFixed(BigNumber.from(deltas[0] || '0').abs(), 18);
        }

        if (this.pool.__typename === 'GqlPoolWeighted') {
            if (poolToken.address === tokenAmount.address) {
                bptIn = poolWeightedBptInForExactTokenOut(this.pool, {
                    address: poolToken.address,
                    amount: tokenAmount.address,
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
            const minAmountOut = oldBnumSubtractSlippage(
                singleAssetExit.exitSwaps ? tokenAmountOut : amountOut,
                poolToken.decimals,
                slippage,
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
            const assets = singleAssetExit.exitSwaps.assets;
            const assetOutIdx = assets.indexOf(tokenOutAddress);
            const swaps = cloneDeep(singleAssetExit.exitSwaps.swaps);
            swaps[0].amount = parseUnits(amountIn, 18).toString();

            const deltas = await poolQueryBatchSwap({
                provider: this.provider,
                swaps,
                assets,
                swapType: SwapTypes.SwapExactIn,
            });

            //Inject the user accepted amount out.
            deltas[assetOutIdx] = `-${parseUnits(amountOut, singleAssetExit.tokenOut.decimals).toString()}`;

            if (this.isWeightedPool) {
                swaps[0].amount = this.batchRelayerService.toChainedReference(poolToken.index).toString();
            }

            calls.push(
                this.batchRelayerService.encodeBatchSwapWithLimits({
                    tokensIn: [this.pool.address],
                    tokensOut: [tokenOutAddress],
                    swaps,
                    assets,
                    deltas,
                    userAddress,
                    ethAmountScaled: '0',
                    slippage,
                    fromInternalBalance: this.isWeightedPool,
                    toInternalBalance: false,
                }),
            );
        }

        //TODO handle unwrap

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

        const exitAmounts = poolGetProportionalExitAmountsForBptIn(
            bptAmountIn,
            this.pool.tokens,
            poolGetTotalShares(this.pool),
        );
        let bptAmounts = exitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address));

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
                }),
                outputReferences: [],
            }),
        );

        for (const nestedStablePoolToken of this.nestedStablePoolTokens) {
            const nestedStablePool = nestedStablePoolToken.pool;
            //assuming a proportional exit, there should always be an amount for this
            const bptAmount = bptAmounts.find((amount) => amount.address === nestedStablePoolToken.address)!;

            const nestedExitAmounts = poolGetProportionalExitAmountsForBptIn(
                bptAmount.amount,
                nestedStablePool.tokens,
                poolGetTotalShares(nestedStablePool),
            );

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
                    }),
                    outputReferences: [],
                }),
            );

            bptAmounts = bptAmounts.concat(
                nestedExitAmounts.filter((amountOut) => !tokensOut.includes(amountOut.address)),
            );
        }

        const nestedLinearPools = this.nestedLinearPoolTokens.map((linearPoolToken) => ({
            linearPoolToken,
            mainToken: poolGetMainTokenFromLinearPoolToken(linearPoolToken),
            wrappedToken: poolGetWrappedTokenFromLinearPoolToken(linearPoolToken),
        }));

        if (nestedLinearPools.length > 0) {
            const { swaps, assets, deltas } = await this.getExitSwaps(bptAmounts, nestedLinearPools);

            calls.push(
                this.batchRelayerService.encodeBatchSwapWithLimits({
                    tokensIn: nestedLinearPools.map((linearPool) => linearPool.linearPoolToken.address),
                    tokensOut: nestedLinearPools.map((linearPool) => linearPool.mainToken.address),
                    deltas,
                    assets,
                    swaps,
                    ethAmountScaled: '0',
                    userAddress,
                    slippage,
                    fromInternalBalance: true,
                    toInternalBalance: false,
                }),
            );
        }

        return {
            type: 'BatchRelayer',
            calls,
        };
    }

    private async getExitSwaps(
        bptAmountsIn: TokenAmountHumanReadable[],
        nestedLinearPools: ComposablePoolExitNestedLinearPool[],
    ): Promise<{
        swaps: SwapV2[];
        deltas: string[];
        assets: string[];
        tokenAmountsOut: TokenAmountHumanReadable[];
        mainTokenAmountsOut: TokenAmountHumanReadable[];
    }> {
        const exitSwaps: { swap: SwapV2; assets: string[]; nestedLinearPool: ComposablePoolExitNestedLinearPool }[] =
            [];

        for (const nestedLinearPool of nestedLinearPools) {
            const { linearPoolToken, mainToken, wrappedToken } = nestedLinearPool;
            const bptAmount = bptAmountsIn.find((amount) => amount.address === linearPoolToken.address);

            if (bptAmount) {
                const hasEnoughMainToken =
                    parseFloat(mainToken.totalBalance) >
                    parseFloat(bptAmount?.amount || '0') * parseFloat(linearPoolToken.pool.bptPriceRate);

                exitSwaps.push({
                    swap: {
                        poolId: linearPoolToken.pool.id,
                        assetInIndex: 0,
                        assetOutIndex: 1,
                        amount: parseFixed(bptAmount?.amount || '0', 18).toString(),
                        userData: '0x',
                    },
                    assets: [linearPoolToken.address, hasEnoughMainToken ? mainToken.address : wrappedToken.address],
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

        const tokenAmountsOut = exitSwaps.map((exitSwap) => {
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
        });

        return {
            swaps,
            deltas,
            assets,
            tokenAmountsOut,
            mainTokenAmountsOut,
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
        const linearPoolToken = this.nestedLinearPoolTokens.find((linearPoolToken) => {
            const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

            return mainToken.address === tokenOption.address;
        });

        const exitSwapPool = this.isStablePool ? this.pool : 'pool' in poolToken ? poolToken.pool : null;

        return {
            tokenOut: this.pool.allTokens.find((token) => token.address === tokenOption.address)!,
            poolToken: this.pool.tokens.find((token) => token.address === option.poolTokenAddress)!,
            linearPool: linearPoolToken
                ? {
                      linearPoolToken,
                      mainToken: poolGetWrappedTokenFromLinearPoolToken(linearPoolToken),
                      wrappedToken: poolGetWrappedTokenFromLinearPoolToken(linearPoolToken),
                  }
                : undefined,
            exitSwaps: exitSwapPool
                ? poolGetExitSwaps({
                      poolId: exitSwapPool.id,
                      poolAddress: exitSwapPool.address,
                      tokenOut: tokenOption.address,
                      bptIn: '0',
                      poolToken,
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
            priceImpact: bptAmountScaled.div(bptZeroPriceImpact).minus(1).toNumber(),
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
    }: {
        pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested;
        bptIn: AmountHumanReadable;
        slippage: string;
        exitAmounts: TokenAmountHumanReadable[];
        finalTokenAmountsOut: TokenAmountHumanReadable[];
        toInternalBalance: boolean;
    }): ExitPoolRequest {
        const bptInScaled = parseUnits(bptIn, 18);
        const tokensWithPhantomBpt =
            pool.__typename === 'GqlPoolWeighted'
                ? pool.tokens
                : sortBy([...pool.tokens, { address: pool.address, decimals: 18, __typename: 'pool' }], 'address');

        const amountsOutScaled = exitAmounts.map((exitAmount) => {
            const token = pool.tokens.find((token) => token.address);

            return parseUnits(exitAmount.amount, token?.decimals || 18).toString();
        });

        return {
            assets: tokensWithPhantomBpt.map((token) => token.address),
            minAmountsOut: tokensWithPhantomBpt.map((token) => {
                const finalAmount = finalTokenAmountsOut.find((amountOut) => amountOut.address === token.address);
                const exitAmount = exitAmounts.find((amountOut) => amountOut.address === token.address);

                if (finalAmount) {
                    return oldBnumScale(
                        oldBnumSubtractSlippage(finalAmount.amount, token.decimals, slippage),
                        token.decimals,
                    ).toString();
                } else if (exitAmount) {
                    return oldBnumScale(
                        oldBnumSubtractSlippage(exitAmount.amount, token.decimals, slippage),
                        token.decimals,
                    ).toString();
                }

                return '0';
            }),
            userData:
                pool.__typename === 'GqlPoolWeighted'
                    ? WeightedPoolEncoder.exitBPTInForExactTokensOut(amountsOutScaled, bptInScaled)
                    : //TODO: move this to the composable stable encoder once its merged in
                      defaultAbiCoder.encode(
                          ['uint256', 'uint256[]', 'uint256'],
                          [1, amountsOutScaled, MaxUint256.toString()],
                      ),
            toInternalBalance,
        };
    }
}
