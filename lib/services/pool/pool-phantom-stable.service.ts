import {
    GqlPoolInvestOption,
    GqlPoolPhantomStable,
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
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
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
import { poolGetJoinSwaps } from '~/lib/services/pool/pool-util';
import { formatFixed } from '@ethersproject/bignumber';
import { oldBnum, oldBnumFromBnum, oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import OldBigNumber from 'bignumber.js';
import { SwapKind } from '@balancer-labs/balancer-js';
import { poolScaleAmp } from '~/lib/services/pool/lib/pool-util';

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

        const joinSwaps = data.tokenAmountsIn.map((tokenAmountIn) => this.getJoinSwapsForTokenAmountIn(tokenAmountIn));
        const batchedSwaps = this.batchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await this.queryBatchSwap(SwapTypes.SwapExactIn, batchedSwaps.swaps, batchedSwaps.assets);

        return {
            type: 'BatchSwap',
            kind: SwapKind.GivenIn,
            swaps: batchedSwaps.swaps,
            assets: batchedSwaps.assets,
            limits: deltas,
        };
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const joinSwaps = tokenAmountsIn.map((tokenAmountIn) => this.getJoinSwapsForTokenAmountIn(tokenAmountIn));
        const batchedSwaps = this.batchSwaps(
            joinSwaps.map((item) => item.assets),
            joinSwaps.map((item) => item.swaps),
        );

        const deltas = await this.queryBatchSwap(SwapTypes.SwapExactIn, batchedSwaps.swaps, batchedSwaps.assets);
        const bptAmount = oldBnum(deltas[batchedSwaps.assets.indexOf(this.pool.address)] ?? '0').abs();
        const bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmountsIn);

        return {
            priceImpact: bptZeroPriceImpact.lt(bptAmount)
                ? 0
                : oldBnum(1).minus(bptAmount.div(bptZeroPriceImpact)).toNumber(),
            minBptReceived: formatFixed(bptAmount.toString(), 18),
        };
    }

    public async exitEstimatePriceImpact(
        input: PoolExitBPTInForExactTokensOut | PoolExitExactBPTInForOneTokenOut,
    ): Promise<number> {
        //TODO: implement
        /*
        // Single asset exit
            if (opts.exactOut) {
                bptAmount = bnum(opts.queryBPT);
                bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts);
            } else {
                // Single asset max out case
                bptAmount = parseUnits(this.calc.bptBalance, this.calc.poolDecimals).toString();
                bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts);
            }

            return bnum(bptAmount).div(bptZeroPriceImpact).minus(1);
         */

        return 0;
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return [];
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

    private getJoinSwapsForTokenAmountIn(tokenAmountIn: TokenAmountHumanReadable): {
        swaps: SwapV2[];
        assets: string[];
    } {
        const poolToken = this.findPoolTokenFromOptions(
            tokenAmountIn.address.toLowerCase(),
            this.pool.investConfig.options,
        );

        return poolGetJoinSwaps({
            poolId: this.pool.id,
            poolAddress: this.pool.address,
            tokenAmountIn,
            poolToken,
        });
    }

    private batchSwaps(assets: string[][], swaps: SwapV2[][]): { swaps: SwapV2[]; assets: string[] } {
        // assest addresses without duplicates
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

    private queryBatchSwap(swapType: SwapTypes, swaps: SwapV2[], assets: string[]): Promise<string[]> {
        const vaultContract = new Contract(networkConfig.balancer.vault, VaultAbi, this.provider);
        const funds: FundManagement = {
            sender: AddressZero,
            recipient: AddressZero,
            fromInternalBalance: false,
            toInternalBalance: false,
        };

        return vaultContract.queryBatchSwap(swapType, swaps, assets, funds);
    }

    private findPoolTokenFromOptions(
        tokenAddress: string,
        options: (GqlPoolWithdrawOption | GqlPoolInvestOption)[],
    ): GqlPoolTokenUnion {
        for (const option of options) {
            for (const tokenOption of option.tokenOptions) {
                if (isSameAddress(tokenAddress, tokenOption.address)) {
                    return this.pool.tokens[option.poolTokenIndex];
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
}
