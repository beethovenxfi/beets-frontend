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
import { Swaps, SwapType, SwapV2, WeightedPoolEncoder } from '@balancer-labs/sdk';
import {
    poolBatchSwaps,
    poolFindNestedPoolTokenForToken,
    poolFindPoolTokenFromOptions,
    poolGetJoinSwapForToken,
    poolQueryBatchSwap,
} from '~/lib/services/pool/pool-phantom-stable-util';
import { SwapTypes } from '@balancer-labs/sor';
import { BaseProvider } from '@ethersproject/providers';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnum, oldBnumScale } from '~/lib/services/pool/lib/old-big-number';
import { formatFixed } from '@ethersproject/bignumber';
import { MaxUint256, Zero } from '@ethersproject/constants';

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
            }),
        );

        calls.push(
            this.encodeJoinPool({
                deltas,
                data,
                ethAmountScaled,
                batchSwapAssets: assets,
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
            ethValue: ethAmount ? ethAmount.toString() : undefined,
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

        const { assets, deltas } = await this.getExitSwaps(exitAmounts);

        return tokensIn.map((tokenIn) => {
            const assetIndex = assets.findIndex((asset) => asset.toLowerCase() === tokenIn);
            const token = this.pool.allTokens.find((token) => token.address === tokenIn)!;

            return {
                address: tokenIn,
                amount: formatFixed(oldBnum(deltas[assetIndex]).abs().toString(), token.decimals),
            };
        });
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
        throw new Error('TODO: implement');
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        throw new Error('TODO: implement');
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        throw new Error('TODO: implement');
    }

    public async exitGetProportionalWithdrawEstimate(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]> {
        return [];
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
    }: {
        tokensIn: string[];
        tokensOut: string[];
        swaps: SwapV2[];
        deltas: AmountScaledString[];
        assets: string[];
        data: PoolJoinData;
        ethAmountScaled: AmountScaledString;
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
            assets,
            funds: {
                sender: data.userAddress,
                recipient: data.userAddress,
                fromInternalBalance: false,
                toInternalBalance: true,
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
    }: {
        deltas: AmountScaledString[];
        batchSwapAssets: string[];
        data: PoolJoinExactTokensInForBPTOut;
        ethAmountScaled: AmountScaledString;
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
                fromInternalBalance: true,
            },
            value: joinHasNativeAsset ? ethAmountScaled : Zero,
            outputReference: data.zapIntoMasterchefFarm ? this.batchRelayerService.toChainedReference(0) : Zero,
        });
    }

    private async getExitSwaps(exitAmounts: (TokenAmountHumanReadable & { tokenOut: string })[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
        /*tokenAmountsMappedToPoolTokens: TokenAmountHumanReadable[];
        tokensIn: string[];
        tokensOut: string[];*/
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

        /*const tokensIn = tokenAmountsIn.map((tokenAmounIn) => tokenAmounIn.address);
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
        });*/

        return { swaps, assets, deltas };
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
}
