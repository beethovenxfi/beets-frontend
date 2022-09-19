import {
    GqlPoolPhantomStable,
    GqlPoolToken,
    GqlPoolTokenUnion,
    GqlPoolWithdrawOption,
} from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinProcessedStepsOutput,
    ComposablePoolJoinStep,
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { SwapTypes } from '@balancer-labs/sor';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { isSameAddress, SwapV2 } from '@balancer-labs/sdk';
import { BaseProvider } from '@ethersproject/providers';
import { oldBnum, oldBnumScaleDown } from '~/lib/services/pool/lib/old-big-number';
import { SwapKind } from '@balancer-labs/balancer-js';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import {
    poolFindNestedPoolTokenForToken,
    poolFindPoolTokenFromOptions,
    poolGetExitSwaps,
    poolGetJoinSwapForToken,
    poolSumPoolTokenBalances,
} from '~/lib/services/pool/pool-phantom-stable-util';
import {
    poolBatchSwaps,
    poolGetJoinSteps,
    poolJoinGetContractCallData,
    poolProcessJoinSteps,
    poolQueryBatchSwap,
} from '~/lib/services/pool/lib/composable-util';

export class PoolComposableStableService implements PoolService {
    private readonly baseService: PoolBaseService;
    private readonly joinSteps: ComposablePoolJoinStep[];

    constructor(
        private pool: GqlPoolPhantomStable,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
        private readonly provider: BaseProvider,
    ) {
        this.baseService = new PoolBaseService(pool, wethAddress);
        this.joinSteps = poolGetJoinSteps(this.pool);
    }

    public updatePool(pool: GqlPoolPhantomStable) {
        this.pool = pool;
        this.baseService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }
        const { processedSteps } = await this.getJoinData(data.tokenAmountsIn, data.slippage);

        return poolJoinGetContractCallData({
            data,
            processedSteps,
            wethAddress: this.wethAddress,
        });
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { priceImpact, minBptReceived, nestedPriceImpacts } = await this.getJoinData(tokenAmountsIn, slippage);

        return {
            priceImpact,
            minBptReceived,
            nestedPriceImpacts,
        };
    }

    private async getJoinData(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<ComposablePoolJoinProcessedStepsOutput> {
        const data = await poolProcessJoinSteps({
            pool: this.pool,
            steps: this.joinSteps,
            tokenAmountsIn,
            provider: this.provider,
            slippage,
        });

        //TODO: cache data while tokenAmountsIn and slippage are constant
        return data;
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        const bptInForTokensOut = this.getProportionallyWeightedBptAmountsForTokensOut(bptIn);
        const { assets, deltas } = await this.getExitSwaps(bptInForTokensOut);

        return this.pool.withdrawConfig.options.map((option) => {
            const tokenOption = option.tokenOptions[0];
            const assetIndex = assets.findIndex((asset) => isSameAddress(asset, tokenOption.address));

            return {
                address: tokenOption.address,
                amount: oldBnumScaleDown(oldBnum(deltas[assetIndex]).abs(), tokenOption.decimals).toString(),
            };
        });
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        const { poolToken, option, tokenOption } = this.getWithdrawOptionAndPoolTokenForTokenOut(tokenAmount.address);
        const { swaps, deltas, assets } = await this.getJoinSwaps([tokenAmount]);

        const bptIndex = assets.findIndex((asset) => isSameAddress(asset, this.pool.address));
        const bptIn = oldBnumScaleDown(oldBnum(deltas[bptIndex]).abs(), 18).toString();

        return {
            priceImpact: 0,
            bptIn,
        };
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        const { tokenOption } = this.getWithdrawOptionAndPoolTokenForTokenOut(tokenOutAddress);
        const { assets, deltas } = await this.getExitSwaps([{ address: tokenOutAddress, amount: bptIn }]);

        const assetIndex = assets.findIndex((asset) => isSameAddress(asset, tokenOutAddress));
        const tokenAmount = oldBnumScaleDown(oldBnum(deltas[assetIndex]).abs(), tokenOption.decimals).toString();

        return {
            tokenAmount,
            priceImpact: 0,
        };
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        if (data.kind === 'ExactBPTInForTokensOut') {
            const bptInForTokensOut = this.getProportionallyWeightedBptAmountsForTokensOut(data.bptAmountIn);
            const { swaps, assets, deltas } = await this.getExitSwaps(bptInForTokensOut);

            return {
                type: 'BatchSwap',
                kind: SwapKind.GivenIn,
                swaps: swaps,
                assets: assets,
                limits: deltas,
            };
        } else if (data.kind === 'ExactBPTInForOneTokenOut') {
            const { swaps, assets, deltas } = await this.getExitSwaps([
                { address: data.tokenOutAddress, amount: data.bptAmountIn },
            ]);

            return {
                type: 'BatchSwap',
                kind: SwapKind.GivenIn,
                swaps: swaps,
                assets: assets,
                limits: deltas,
            };
        }

        throw new Error('unsupported join type');
    }

    private async getJoinSwaps(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
        tokensIn: string[];
        tokensOut: string[];
    }> {
        const tokensOut: string[] = [];
        const joinSwaps = tokenAmountsIn.map((tokenAmountIn) => {
            const poolToken = poolFindPoolTokenFromOptions(
                tokenAmountIn.address,
                this.pool.tokens,
                this.pool.investConfig.options,
            );
            tokensOut.push(poolToken.address);

            return poolGetJoinSwapForToken({
                poolId: this.pool.id,
                poolAddress: this.pool.address,
                tokenAmountIn,
                poolToken,
            });
        });

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

        const tokensIn = tokenAmountsIn.map((tokenAmountIn) => tokenAmountIn.address);

        return { swaps, assets, deltas, tokensIn, tokensOut };
    }

    private async getExitSwaps(bptInForTokens: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
    }> {
        const exitSwaps = bptInForTokens.map((bptInForToken) => {
            const poolToken = poolFindPoolTokenFromOptions(
                bptInForToken.address,
                this.pool.tokens,
                this.pool.withdrawConfig.options,
            );

            return poolGetExitSwaps({
                poolId: this.pool.id,
                poolAddress: this.pool.address,
                poolToken,
                tokenOut: bptInForToken.address,
                bptIn: bptInForToken.amount,
            });
        });

        const { swaps, assets } = poolBatchSwaps(
            exitSwaps.map((item) => item.assets),
            exitSwaps.map((item) => item.swaps),
        );

        const deltas = await poolQueryBatchSwap({
            swapType: SwapTypes.SwapExactIn,
            swaps,
            assets,
            provider: this.provider,
        });

        return { swaps, assets, deltas };
    }

    private getProportionallyWeightedBptAmountsForTokensOut(bptIn: AmountHumanReadable): TokenAmountHumanReadable[] {
        const totalBalance = poolSumPoolTokenBalances(this.pool.tokens);

        return this.pool.withdrawConfig.options.map((option) => {
            //currently we only support single option select here
            const tokenOption = option.tokenOptions[0];
            const poolToken = this.pool.tokens.find((poolToken) => poolToken.index === option.poolTokenIndex)!;
            const poolTokenWeight = oldBnum(poolToken.balance).div(totalBalance);

            if (poolToken.__typename === 'GqlPoolToken' || poolToken.__typename === 'GqlPoolTokenLinear') {
                return {
                    address: tokenOption.address,
                    amount: oldBnum(bptIn).times(poolTokenWeight).toFixed(18).toString(),
                };
            }

            const nestedTotalBalance = poolSumPoolTokenBalances(poolToken.pool.tokens);
            const nestedPoolToken = poolFindNestedPoolTokenForToken(tokenOption.address, poolToken.pool.tokens);
            const nestedWeight = oldBnum(nestedPoolToken.balance).div(nestedTotalBalance);

            return {
                address: tokenOption.address,
                amount: oldBnum(bptIn).times(poolTokenWeight).times(nestedWeight).toFixed(18).toString(),
            };
        });
    }

    private getWithdrawOptionAndPoolTokenForTokenOut(tokenOutAddress: string): {
        option: GqlPoolWithdrawOption;
        poolToken: GqlPoolTokenUnion;
        tokenOption: GqlPoolToken;
    } {
        const option = this.pool.withdrawConfig.options.find((option) =>
            option.tokenOptions.find((tokenOption) => tokenOption.address === tokenOutAddress),
        );

        if (!option) {
            throw new Error(`No option found for token ${tokenOutAddress}`);
        }

        const poolToken = this.pool.tokens.find((token) => token.index === option.poolTokenIndex);

        if (!poolToken) {
            throw new Error(`No pool token found for token ${tokenOutAddress}`);
        }

        return { option, poolToken, tokenOption: option.tokenOptions[0] };
    }
}
