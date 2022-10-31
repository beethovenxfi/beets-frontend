import {
    GqlPoolTokenLinear,
    GqlPoolTokenPhantomStable,
    GqlPoolTokenUnion,
    GqlPoolWeighted,
} from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitPoolContractCallData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolJoinExactTokensInForBPTOut,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { PoolWeightedService } from '~/lib/services/pool/pool-weighted.service';
import { isSameAddress, Swaps, SwapType, SwapV2, WeightedPoolEncoder } from '@balancer-labs/sdk';
import {
    poolFindNestedPoolTokenForToken,
    poolFindPoolTokenFromOptions,
    poolGetJoinSwapForToken,
} from '~/lib/services/pool/pool-phantom-stable-util';
import { SwapTypes } from '@balancer-labs/sor';
import { BaseProvider } from '@ethersproject/providers';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnum, oldBnumScale } from '~/lib/services/pool/lib/old-big-number';
import { formatFixed } from '@ethersproject/bignumber';
import { poolBatchSwaps, poolQueryBatchSwap, poolScaleTokenAmounts } from '~/lib/services/pool/lib/util';
import { MaxUint256, Zero } from '@ethersproject/constants';
import { poolIsTokenPhantomBpt } from '~/lib/services/pool/pool-util';

export class PoolWeightedBoostedService implements PoolService {
    private baseService: PoolBaseService;
    private weightedPoolService: PoolWeightedService;

    constructor(
        private pool: GqlPoolWeighted,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
        private readonly provider: BaseProvider,
    ) {
        this.baseService = new PoolBaseService(pool, wethAddress);
        this.weightedPoolService = new PoolWeightedService(pool, batchRelayerService, wethAddress);
    }

    public updatePool(pool: GqlPoolWeighted) {
        this.pool = pool;
        this.baseService.updatePool(pool);
        this.weightedPoolService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const calls: string[] = [];
        const { swaps, assets, deltas, tokensIn, tokensOut } = await this.getJoinSwaps(data.tokenAmountsIn);
        const ethAmount = data.wethIsEth
            ? data.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === this.wethAddress)
            : undefined;
        const ethAmountScaled = (ethAmount ? parseUnits(ethAmount.amount, 18) : Zero).toString();

        calls.push(
            this.encodeBatchSwapStep({
                tokensIn,
                tokensOut,
                deltas,
                data,
                ethAmountScaled,
                assets,
                swaps,
                fromInternalBalance: false,
                toInternalBalance: true,
                wethIsEth: data.wethIsEth,
            }),
        );

        calls.push(
            this.encodeJoinPool({
                deltas,
                data,
                ethAmountScaled,
                batchSwapAssets: assets,
                fromInternalBalance: true,
            }),
        );

        if (data.zapIntoMasterchefFarm) {
            calls.push(
                this.batchRelayerService.masterChefEncodeDeposit({
                    sender: this.batchRelayerService.batchRelayerAddress,
                    recipient: data.userAddress,
                    token: this.pool.address,
                    pid: parseInt(this.pool.staking!.id),
                    amount: this.batchRelayerService.toChainedReference(0),
                    outputReference: Zero,
                }),
            );
        }

        return {
            type: 'BatchRelayer',
            calls,
            ethValue: ethAmount ? ethAmountScaled : undefined,
        };
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        const { tokenAmountsMappedToPoolTokens } = await this.getJoinSwaps([fixedAmount]);

        if (tokenAmountsMappedToPoolTokens.length !== 1) {
            throw new Error('PoolWeightedBoostedService: Incorrect token amounts returned by getJoinSwaps');
        }

        //these suggestions are now in the pool tokens (base + phantom bpts)
        const proportionalSuggestions = await this.weightedPoolService.joinGetProportionalSuggestionForFixedAmount(
            tokenAmountsMappedToPoolTokens[0],
            tokenAmountsMappedToPoolTokens.map((poolToken) => poolToken.address),
        );

        //we map the suggestions back to the invest tokens
        const exitAmounts = proportionalSuggestions.map((suggestion) => {
            const option = this.pool.investConfig.options.find(
                (option) => option.poolTokenAddress === suggestion.address,
            )!;

            const tokenOption = option.tokenOptions.find((tokenOption) => tokensIn.includes(tokenOption.address))!;

            return {
                ...suggestion,
                tokenOut: tokenOption.address,
            };
        });

        const { tokenOutAmounts } = await this.getExitSwaps(exitAmounts);

        return tokenOutAmounts;
    }

    //we're disregarding the price impact of entering the phantom stable.
    //assuming deep enough liquidity, the price impact there should be negligible
    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { tokenAmountsMappedToPoolTokens } = await this.getJoinSwaps(tokenAmountsIn);
        const bptAmount = this.weightedPoolService.exactTokensInForBPTOut(tokenAmountsMappedToPoolTokens);

        if (bptAmount.lt(0)) {
            return { priceImpact: 0, minBptReceived: '0' };
        }

        const bptZeroPriceImpact = this.weightedPoolService.bptForTokensZeroPriceImpact(tokenAmountsMappedToPoolTokens);
        const minBptReceived = bptAmount.minus(bptAmount.times(slippage)).toFixed(0);

        return {
            priceImpact: bptAmount.div(bptZeroPriceImpact).minus(1).toNumber(),
            minBptReceived: formatFixed(minBptReceived.toString(), 18),
        };
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        const tokensOut =
            data.kind === 'ExactBPTInForOneTokenOut'
                ? [data.tokenOutAddress]
                : data.amountsOut.map((amount) => amount.address);
        let exitContractData: PoolExitPoolContractCallData;
        let exitAmountsOut: TokenAmountHumanReadable[] = [];

        if (data.kind === 'ExactBPTInForTokensOut') {
            const withdrawAmounts = await this.weightedPoolService.exitGetProportionalWithdrawEstimate(
                data.bptAmountIn,
                this.pool.tokens.map((token) => token.address),
            );

            exitAmountsOut = withdrawAmounts;
            exitContractData = await this.weightedPoolService.exitGetContractCallData({
                ...data,
                amountsOut: withdrawAmounts,
            });
        } else if (data.kind === 'ExactBPTInForOneTokenOut') {
            const poolToken = poolFindPoolTokenFromOptions(
                data.tokenOutAddress,
                this.pool.tokens,
                this.pool.withdrawConfig.options,
            );

            const weightedExitData = await this.weightedPoolService.exitGetSingleAssetWithdrawForBptIn(
                data.bptAmountIn,
                poolToken.address,
            );

            exitAmountsOut = [{ address: poolToken.address, amount: weightedExitData.tokenAmount }];
            exitContractData = await this.weightedPoolService.exitGetContractCallData({
                ...data,
                tokenOutAddress: poolToken.address,
                amountOut: weightedExitData.tokenAmount,
            });
        } else {
            throw new Error('Unsupported exit type: ' + data.kind);
        }

        //keep track of the output references for the batch swap out
        const outputReferences = exitContractData.assets.map((asset, index) => ({
            asset,
            index,
            key: this.batchRelayerService.toChainedReference(index),
        }));

        const poolExit = this.batchRelayerService.vaultConstructExitCall({
            poolId: this.pool.id,
            poolKind: 0,
            assets: exitContractData.assets,
            minAmountsOut: exitContractData.minAmountsOut.map((amount) => amount.toString()),
            userData: exitContractData.userData,
            sender: data.userAddress,
            recipient: data.userAddress,
            outputReferences,
            toInternalBalance: this.hasOnlyPhantomBpts,
        });

        const phantomBptTokensWithExits = this.phantomBptPoolTokens.filter((token) =>
            exitAmountsOut.find((amountOut) => amountOut.address === token.address),
        );

        const batchSwapEntries = phantomBptTokensWithExits.map((poolToken) => {
            const exitAmountOut = exitAmountsOut.find((amountOut) => amountOut.address === poolToken.address)!;
            const option = this.pool.withdrawConfig.options.find(
                (option) => option.poolTokenIndex === poolToken.index,
            )!;
            const tokenOut = option.tokenOptions.find((tokenOption) => tokensOut.includes(tokenOption.address))!;

            return {
                address: poolToken.address,
                amount: exitAmountOut.amount,
                tokenOut: tokenOut.address,
            };
        });

        const { swaps, deltas, assets } = await this.getExitSwaps(batchSwapEntries);

        // Update swap amounts with ref outputs from exitPool
        swaps.forEach((swap) => {
            const token = assets[swap.assetInIndex];
            const index = outputReferences.findIndex((ref) => isSameAddress(ref.asset, token));

            if (index !== -1) {
                swap.amount = outputReferences[index].key.toString();
            }
        });

        //apply the slippage to the amounts out for the batch swap
        assets.forEach((asset, assetIdx) => {
            if (tokensOut.includes(asset)) {
                deltas[assetIdx] = oldBnum(deltas[assetIdx])
                    .times(1 - parseFloat(data.slippage))
                    .toFixed(0);
            }
        });

        const batchSwap = this.batchRelayerService.vaultEncodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps,
            assets,
            funds: {
                sender: data.userAddress,
                recipient: data.userAddress,
                fromInternalBalance: this.hasOnlyPhantomBpts,
                toInternalBalance: false,
            },
            limits: deltas,
            deadline: MaxUint256,
            value: Zero,
            outputReferences: [],
        });

        //TODO need to add unwrap support

        return {
            type: 'BatchRelayer',
            calls: [poolExit, batchSwap],
        };
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        const poolToken = poolFindPoolTokenFromOptions(
            tokenAmount.address,
            this.pool.tokens,
            this.pool.withdrawConfig.options,
        );

        if (tokenAmount.address === poolToken.address) {
            return this.weightedPoolService.exitGetBptInForSingleAssetWithdraw(tokenAmount);
        }

        const { tokenAmountsMappedToPoolTokens } = await this.getJoinSwaps([tokenAmount]);

        return this.weightedPoolService.exitGetBptInForSingleAssetWithdraw(tokenAmountsMappedToPoolTokens[0]);
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        const poolToken = poolFindPoolTokenFromOptions(
            tokenOutAddress,
            this.pool.tokens,
            this.pool.withdrawConfig.options,
        );

        const weightedExitData = await this.weightedPoolService.exitGetSingleAssetWithdrawForBptIn(
            bptIn,
            poolToken.address,
        );

        if (poolToken.address === tokenOutAddress) {
            return weightedExitData;
        }

        const { tokenOutAmounts } = await this.getExitSwaps([
            { address: poolToken.address, amount: weightedExitData.tokenAmount, tokenOut: tokenOutAddress },
        ]);

        return {
            priceImpact: weightedExitData.priceImpact,
            tokenAmount: tokenOutAmounts[0].amount,
        };
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        const withdrawAmounts = await this.weightedPoolService.exitGetProportionalWithdrawEstimate(
            bptIn,
            this.pool.tokens.map((token) => token.address),
        );

        const exitAmounts = withdrawAmounts
            .filter((withdrawAmount) => withdrawAmount.address)
            .map(({ amount, address }) => {
                const option = this.pool.withdrawConfig.options.find((option) => option.poolTokenAddress === address)!;
                const tokenOption = option.tokenOptions.find((tokenOption) => tokensOut.includes(tokenOption.address))!;

                return { address, amount, tokenOut: tokenOption.address };
            });

        const { tokenOutAmounts } = await this.getExitSwaps(exitAmounts);

        return tokenOutAmounts;
    }

    private async getJoinSwaps(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
        tokenAmountsMappedToPoolTokens: TokenAmountHumanReadable[];
        tokensIn: string[];
        tokensOut: string[];
    }> {
        const joinSwaps: { swaps: SwapV2[]; assets: string[] }[] = [];

        for (const tokenAmountIn of tokenAmountsIn) {
            const poolToken = poolFindPoolTokenFromOptions(
                tokenAmountIn.address,
                this.pool.tokens,
                this.pool.investConfig.options,
            );

            //we're only concerned with nested phantom bpts
            if (poolToken.__typename === 'GqlPoolTokenLinear' || poolToken.__typename === 'GqlPoolTokenPhantomStable') {
                //get join swaps adds this pool as the last item, which is not needed for the weighted pool so we remove it.
                const { swaps, assets } = poolGetJoinSwapForToken({
                    poolId: this.pool.id,
                    poolAddress: this.pool.address,
                    tokenAmountIn,
                    poolToken,
                });

                joinSwaps.push({ swaps: swaps.slice(0, swaps.length - 1), assets: assets.slice(0, assets.length - 1) });
            }
        }

        const { swaps, assets } = poolBatchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider: this.provider,
        });

        const tokensIn = tokenAmountsIn.map((tokenAmounIn) => tokenAmounIn.address);
        const tokensOut: string[] = [];
        const tokenAmountsMappedToPoolTokens = tokenAmountsIn.map((tokenAmountIn) => {
            const poolToken = poolFindPoolTokenFromOptions(
                tokenAmountIn.address,
                this.pool.tokens,
                this.pool.investConfig.options,
            );

            if (poolToken.__typename === 'GqlPoolTokenPhantomStable' || poolToken.__typename === 'GqlPoolTokenLinear') {
                const assetIndex = assets.findIndex((asset) => asset === poolToken.address);
                const delta = deltas[assetIndex];

                tokensOut.push(poolToken.address);

                return {
                    address: poolToken.address,
                    amount: formatFixed(oldBnum(delta).abs().toString(), 18),
                };
            }

            return tokenAmountIn;
        });

        return { swaps, assets, deltas, tokenAmountsMappedToPoolTokens, tokensOut, tokensIn };
    }

    private encodeBatchSwapStep({
        tokensIn,
        tokensOut,
        deltas,
        assets,
        data,
        swaps,
        ethAmountScaled,
        fromInternalBalance,
        toInternalBalance,
        wethIsEth,
    }: {
        tokensIn: string[];
        tokensOut: string[];
        swaps: SwapV2[];
        deltas: AmountScaledString[];
        assets: string[];
        data: PoolJoinData | PoolExitData;
        ethAmountScaled: AmountScaledString;
        fromInternalBalance: boolean;
        toInternalBalance: boolean;
        wethIsEth: boolean;
    }): string {
        const limits = Swaps.getLimitsForSlippage(
            tokensIn,
            tokensOut,
            SwapType.SwapExactIn,
            deltas,
            assets,
            //5%=50_000_000_000_000_000.
            `${oldBnumScale(data.slippage, 16).toFixed(0)}`,
        );

        return this.batchRelayerService.vaultEncodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps,
            assets: wethIsEth ? assets.map((asset) => this.baseService.wethToZero(asset)) : assets,
            funds: {
                sender: data.userAddress,
                recipient: data.userAddress,
                fromInternalBalance,
                toInternalBalance,
            },
            limits: limits.map((l) => l.toString()),
            deadline: MaxUint256,
            value: ethAmountScaled,
            outputReferences: assets.map((asset, index) => ({
                index,
                key: this.batchRelayerService.toChainedReference(index),
            })),
        });
    }

    private encodeJoinPool({
        deltas,
        batchSwapAssets,
        data,
        ethAmountScaled,
        fromInternalBalance,
    }: {
        deltas: AmountScaledString[];
        batchSwapAssets: string[];
        data: PoolJoinExactTokensInForBPTOut;
        ethAmountScaled: AmountScaledString;
        fromInternalBalance: boolean;
    }): string {
        const joinHasNativeAsset =
            data.wethIsEth && this.pool.tokens.find((token) => token.address === this.wethAddress);

        const amountsIn = this.pool.tokens.map((token) => {
            const tokenAmountIn = data.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === token.address);

            if (tokenAmountIn) {
                return parseUnits(tokenAmountIn.amount, token.decimals).toString();
            }

            //This token is a nested BPT, not a mainToken
            //Replace the amount with the chained reference value
            const index = batchSwapAssets.findIndex((asset) => asset.toLowerCase() === token.address) || -1;

            //if the return amount is 0, we dont pass on the chained reference
            if (index === -1 || deltas[index] === '0') {
                return '0';
            }

            return this.batchRelayerService.toChainedReference(index);
        });

        return this.batchRelayerService.vaultEncodeJoinPool({
            poolId: this.pool.id,
            poolKind: 0,
            sender: data.userAddress,
            recipient: data.zapIntoMasterchefFarm ? this.batchRelayerService.batchRelayerAddress : data.userAddress,
            joinPoolRequest: {
                assets: this.pool.tokens.map((token) =>
                    data.wethIsEth ? this.baseService.wethToZero(token.address) : token.address,
                ),
                maxAmountsIn: amountsIn,
                userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(amountsIn, parseUnits(data.minimumBpt, 18)),
                fromInternalBalance,
            },
            value: joinHasNativeAsset ? ethAmountScaled : Zero,
            outputReference: data.zapIntoMasterchefFarm ? this.batchRelayerService.toChainedReference(0) : Zero,
        });
    }

    private async getExitSwaps(exitAmounts: (TokenAmountHumanReadable & { tokenOut: string })[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
        tokenOutAmounts: TokenAmountHumanReadable[];
    }> {
        const joinSwaps: { swaps: SwapV2[]; assets: string[] }[] = [];

        for (const exitAmount of exitAmounts) {
            const poolToken = this.pool.tokens.find((poolToken) => poolToken.address === exitAmount.address);

            if (!poolToken) {
                throw new Error(`Exit token is not a pool token: ${exitAmount.amount}`);
            }

            //we're only concerned with nested phantom bpts
            if (poolToken.__typename === 'GqlPoolTokenLinear' || poolToken.__typename === 'GqlPoolTokenPhantomStable') {
                joinSwaps.push(
                    this.phantomBptPoolTokenGetExitSwaps({
                        tokenOut: exitAmount.tokenOut,
                        bptIn: exitAmount.amount,
                        poolToken,
                    }),
                );
            }
        }

        const { swaps, assets } = poolBatchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider: this.provider,
        });
        const tokenOutAmounts = exitAmounts.map(({ address, tokenOut, amount }) => {
            //this is a non nested (base) token, no swaps required.
            if (address === tokenOut) {
                return { address: tokenOut, amount: amount };
            }

            const assetIndex = assets.findIndex((asset) => asset.toLowerCase() === tokenOut);
            const token = this.pool.allTokens.find((token) => token.address === tokenOut)!;

            if (assetIndex === -1) {
                throw new Error(`getExitSwaps: Nested BPT missing in assets array ${tokenOut}`);
            }

            return {
                address: tokenOut,
                amount: formatFixed(oldBnum(deltas[assetIndex]).abs().toString(), token.decimals),
            };
        });

        return { swaps, assets, deltas, tokenOutAmounts };
    }

    private phantomBptPoolTokenGetExitSwaps({
        bptIn,
        poolToken,
        tokenOut,
    }: {
        bptIn: AmountHumanReadable;
        tokenOut: string;
        poolToken: GqlPoolTokenUnion;
    }): { swaps: SwapV2[]; assets: string[] } {
        const bptInScaled = parseUnits(bptIn, 18).toString();

        if (poolToken.__typename === 'GqlPoolTokenLinear') {
            const nestedToken = poolToken.pool.tokens.find((token) => token.address === tokenOut);

            if (!nestedToken) {
                throw new Error(`Token does not exist in pool token: ${tokenOut}`);
            }

            return {
                swaps: [
                    {
                        poolId: poolToken.pool.id,
                        assetInIndex: 0,
                        assetOutIndex: 1,
                        amount: bptInScaled,
                        userData: '0x',
                    },
                ],
                assets: [poolToken.address, nestedToken.address],
            };
        } else if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
            const nestedPoolToken = poolFindNestedPoolTokenForToken(tokenOut, poolToken.pool.tokens);

            if (!nestedPoolToken) {
                throw new Error(`Token does not exist in pool token: ${tokenOut}`);
            }

            const { swaps, assets } = this.phantomBptPoolTokenGetExitSwaps({
                bptIn: '0',
                poolToken: nestedPoolToken,
                tokenOut,
            });

            return {
                swaps: [
                    {
                        poolId: poolToken.pool.id,
                        assetInIndex: 0,
                        assetOutIndex: 1,
                        amount: bptInScaled,
                        userData: '0x',
                    },
                    ...swaps.map((swap) => ({
                        ...swap,
                        assetInIndex: swap.assetInIndex + 1,
                        assetOutIndex: swap.assetOutIndex + 1,
                    })),
                ],
                assets: [poolToken.address, ...assets],
            };
        }

        throw new Error(`No available join swap path for poolId: ${poolToken.address} and token: ${tokenOut}`);
    }

    private get hasOnlyPhantomBpts() {
        return this.pool.nestingType === 'HAS_ONLY_PHANTOM_BPT';
    }

    private get phantomBptPoolTokens() {
        return this.pool.tokens.filter(poolIsTokenPhantomBpt);
    }
}
