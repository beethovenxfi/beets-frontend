import {
    GqlPoolInvestOption,
    GqlPoolPhantomStable,
    GqlPoolToken,
    GqlPoolTokenUnion,
    GqlPoolWithdrawOption,
} from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBPTInForExactTokensOut,
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitExactBPTInForOneTokenOut,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    phantomStableBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact,
    SwapTypes,
} from '@balancer-labs/sor';
import { parseUnits } from 'ethers/lib/utils';
import { PoolBaseService } from '~/lib/services/pool/lib/pool-base.service';
import { FundManagement, isSameAddress, SwapV2 } from '@balancer-labs/sdk';
import { networkConfig } from '~/lib/config/network-config';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { BaseProvider } from '@ethersproject/providers';
import { cloneDeep } from 'lodash';
import VaultAbi from '../../abi/VaultAbi.json';
import {
    poolFindNestedPoolTokenForToken,
    poolGetExitSwaps,
    poolGetJoinSwaps,
    poolSumPoolTokenBalances,
} from '~/lib/services/pool/pool-util';
import { formatFixed } from '@ethersproject/bignumber';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScaleAmount,
    oldBnumScaleDown,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import OldBigNumber from 'bignumber.js';
import { SwapKind } from '@balancer-labs/balancer-js';
import { poolGetRequiredToken, poolScaleAmp } from '~/lib/services/pool/lib/pool-util';
import { BigNumber } from 'ethers';
import * as SDK from '@georgeroman/balancer-v2-pools';

export class PoolPhantomStableService implements PoolService {
    private readonly baseService: PoolBaseService;

    constructor(private pool: GqlPoolPhantomStable, private readonly provider: BaseProvider) {
        this.baseService = new PoolBaseService(pool);
    }

    public updatePool(pool: GqlPoolPhantomStable) {
        this.pool = pool;
        this.baseService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const { swaps, assets, deltas } = await this.getJoinSwaps(data.tokenAmountsIn);

        return {
            type: 'BatchSwap',
            kind: SwapKind.GivenIn,
            swaps: swaps,
            assets: assets,
            limits: deltas,
        };
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { assets, deltas } = await this.getJoinSwaps(tokenAmountsIn);
        const bptAmount = oldBnum(deltas[assets.indexOf(this.pool.address)] ?? '0').abs();
        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmountsIn);

        return {
            priceImpact: bptZeroPriceImpact.lt(bptAmount)
                ? 0
                : oldBnum(1).minus(bptAmount.div(bptZeroPriceImpact)).toNumber(),
            minBptReceived: formatFixed(bptAmount.toString(), 18),
        };
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        throw new Error('joinGetProportionalSuggestionForFixedAmount not supported for phantom stable');
    }

    public async exitGetProportionalWithdrawEstimate(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]> {
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

    private bptForTokensZeroPriceImpact(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber {
        const denormAmounts = this.getDenormAmounts(tokenAmounts, this.pool.tokens);

        // This function should use pool balances (i.e. without rate conversion)
        const poolTokenBalances = this.pool.tokens.map((token) => parseUnits(token.balance, token.decimals));
        const poolTokenDecimals = this.pool.tokens.map((token) => token.decimals);

        const bptZeroImpact = _bptForTokensZeroPriceImpact(
            poolTokenBalances,
            poolTokenDecimals,
            denormAmounts,
            this.baseService.totalSharesScaled.toString(),
            this.baseService.ampScaled.toString(),
            this.baseService.swapFeeScaled.toString(),
            this.baseService.priceRatesScaled.map((priceRate) => priceRate.toString()),
        );

        return oldBnumFromBnum(bptZeroImpact);
    }

    private async getJoinSwaps(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
    }> {
        const joinSwaps = tokenAmountsIn.map((tokenAmountIn) => {
            const poolToken = this.findPoolTokenFromOptions(tokenAmountIn.address, this.pool.investConfig.options);

            return poolGetJoinSwaps({
                poolId: this.pool.id,
                poolAddress: this.pool.address,
                tokenAmountIn,
                poolToken,
            });
        });

        const { swaps, assets } = this.batchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await this.queryBatchSwap(SwapTypes.SwapExactIn, swaps, assets);

        return { swaps, assets, deltas };
    }

    private async getExitSwaps(bptInForTokens: TokenAmountHumanReadable[]): Promise<{
        swaps: SwapV2[];
        assets: string[];
        deltas: AmountScaledString[];
    }> {
        const exitSwaps = bptInForTokens.map((bptInForToken) => {
            const poolToken = this.findPoolTokenFromOptions(bptInForToken.address, this.pool.withdrawConfig.options);

            return poolGetExitSwaps({
                poolId: this.pool.id,
                poolAddress: this.pool.address,
                poolToken,
                tokenOut: bptInForToken.address,
                bptIn: bptInForToken.amount,
            });
        });

        const { swaps, assets } = this.batchSwaps(
            exitSwaps.map((item) => item.assets),
            exitSwaps.map((item) => item.swaps),
        );

        const deltas = await this.queryBatchSwap(SwapTypes.SwapExactIn, swaps, assets);

        return { swaps, assets, deltas };
    }

    private batchSwaps(assets: string[][], swaps: SwapV2[][]): { swaps: SwapV2[]; assets: string[] } {
        // asset addresses without duplicates
        const joinedAssets = assets.flat();
        //create a deep copy to ensure we do not mutate the input
        const clonedSwaps = cloneDeep(swaps);

        // Update indices of each swap to use new asset array
        clonedSwaps.forEach((swap, i) => {
            swap.forEach((poolSwap) => {
                poolSwap.assetInIndex = joinedAssets.indexOf(assets[i][poolSwap.assetInIndex]);
                poolSwap.assetOutIndex = joinedAssets.indexOf(assets[i][poolSwap.assetOutIndex]);
            });
        });

        // Join Swaps into a single batchSwap
        const batchedSwaps = clonedSwaps.flat();

        return { swaps: batchedSwaps, assets: joinedAssets };
    }

    private async queryBatchSwap(swapType: SwapTypes, swaps: SwapV2[], assets: string[]): Promise<string[]> {
        const vaultContract = new Contract(networkConfig.balancer.vault, VaultAbi, this.provider);
        const funds: FundManagement = {
            sender: AddressZero,
            recipient: AddressZero,
            fromInternalBalance: false,
            toInternalBalance: false,
        };

        const response = await vaultContract.queryBatchSwap(swapType, swaps, assets, funds);

        return response.map((item: BigNumber) => item.toString());
    }

    private findPoolTokenFromOptions(
        tokenAddress: string,
        options: (GqlPoolWithdrawOption | GqlPoolInvestOption)[],
    ): GqlPoolTokenUnion {
        for (const option of options) {
            for (const tokenOption of option.tokenOptions) {
                if (isSameAddress(tokenAddress, tokenOption.address)) {
                    const poolToken = this.pool.tokens.find((token) => token.index === option.poolTokenIndex);

                    if (poolToken) {
                        return poolToken;
                    }
                }
            }
        }

        throw new Error(`Token was not found in the provided options: ${tokenAddress}`);
    }

    private getDenormAmounts(tokenAmounts: TokenAmountHumanReadable[], poolTokens: GqlPoolTokenUnion[]) {
        return poolTokens.map((poolToken) => {
            if (poolToken.__typename === 'GqlPoolToken') {
                const tokenAmount = tokenAmounts.find((amount) => amount.address === poolToken.address);

                return tokenAmount ? parseUnits(tokenAmount.amount, poolToken.decimals).toString() : '0';
            } else if (poolToken.__typename === 'GqlPoolTokenLinear') {
                const linearPool = poolToken.pool;
                const mainToken = linearPool.tokens.find((token) => token.index === linearPool.mainIndex);
                const mainTokenAmount = tokenAmounts.find((amount) => amount.address === mainToken?.address);

                if (!mainToken || !mainTokenAmount) {
                    return '0';
                }

                return parseUnits(mainTokenAmount.amount, 18).toString();
            } else if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
                //we calc the bpt for zero price impact assuming an independent invest into the phantom stable
                const phantomStable = poolToken.pool;
                const denormAmounts = this.getDenormAmounts(tokenAmounts, poolToken.pool.tokens);

                const balances = phantomStable.tokens.map((token) => parseUnits(token.balance, token.decimals));
                const decimals = phantomStable.tokens.map((token) => token.decimals);

                const bptZeroImpact = _bptForTokensZeroPriceImpact(
                    balances,
                    decimals,
                    denormAmounts,
                    oldBnumScaleAmount(poolToken.balance).toString(),
                    oldBnumFromBnum(poolScaleAmp(phantomStable.amp)).toString(),
                    oldBnumScaleAmount(phantomStable.swapFee).toString(),
                    phantomStable.tokens.map((token) => oldBnumScaleAmount(token.priceRate, 18).toString()),
                );

                return bptZeroImpact.toString();
            }

            return '0';
        });
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
