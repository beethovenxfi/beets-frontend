import {
    GqlPoolLinearNested,
    GqlPoolPhantomStable,
    GqlPoolPhantomStableNested,
    GqlPoolToken,
    GqlPoolTokenBase,
    GqlPoolTokenLinear,
    GqlPoolTokenPhantomStable,
    GqlPoolTokenUnion,
    GqlPoolWeighted,
} from '~/apollo/generated/graphql-codegen-generated';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScale,
    oldBnumScaleAmount,
    oldBnumToBnum,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import OldBigNumber from 'bignumber.js';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { PoolJoinExactTokensInForBPTOut, PoolWithPossibleNesting } from '~/lib/services/pool/pool-types';
import { AddressZero, WeiPerEther, Zero } from '@ethersproject/constants';
import * as SDK from '@georgeroman/balancer-v2-pools';
import {
    FundManagement,
    stableBPTForTokensZeroPriceImpact,
    SwapV2,
    weightedBPTForTokensZeroPriceImpact,
} from '@balancer-labs/sdk';
import { cloneDeep } from 'lodash';
import { BaseProvider } from '@ethersproject/providers';
import { SwapTypes } from '@balancer-labs/sor';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { formatFixed } from '@ethersproject/bignumber';

export function poolScaleAmp(amp: string): BigNumber {
    // amp is stored with 3 decimals of precision
    return parseUnits(amp, 3);
}

export function oldBnumPoolScaleTokenAmounts(
    tokenAmounts: TokenAmountHumanReadable[],
    poolTokens: GqlPoolTokenBase[],
): OldBigNumber[] {
    return poolTokens.map((poolToken) => {
        const amount = tokenAmounts.find((amount) => amount.address === poolToken.address);

        return amount ? oldBnumScaleAmount(amount.amount, poolToken.decimals) : oldBnumZero();
    });
}

export function poolScaleTokenAmounts(
    tokenAmounts: TokenAmountHumanReadable[],
    poolTokens: GqlPoolTokenBase[],
): BigNumber[] {
    return poolTokens.map((poolToken) => {
        const amount = tokenAmounts.find((amount) => amount.address === poolToken.address);

        return amount ? parseUnits(amount.amount, poolToken.decimals) : BigNumber.from(0);
    });
}

export function poolGetRequiredToken(address: string, tokens: GqlPoolTokenBase[]): GqlPoolTokenBase {
    const token = tokens.find((token) => token.address === address.toLowerCase());

    if (!token) {
        throw new Error(`Token with address does not exist in pool: ${address}`);
    }

    return token;
}

export function poolGetProportionalJoinAmountsForFixedAmount(
    fixedTokenAmount: TokenAmountHumanReadable,
    poolTokens: GqlPoolTokenBase[],
): TokenAmountHumanReadable[] {
    const fixedToken = poolGetRequiredToken(fixedTokenAmount.address, poolTokens);
    const fixedAmountScaled = parseUnits(fixedTokenAmount.amount, fixedToken.decimals);
    const fixedTokenBalance = parseUnits(fixedToken.balance, fixedToken.decimals);

    return poolTokens.map((token) => {
        if (token.address === fixedTokenAmount.address) {
            return { address: token.address, amount: fixedTokenAmount.amount };
        }

        const tokenBalance = parseUnits(token.balance, token.decimals);
        const tokenProportionalAmount = fixedAmountScaled.mul(tokenBalance).div(fixedTokenBalance);

        return {
            address: token.address,
            amount: formatUnits(tokenProportionalAmount, token.decimals),
        };
    });
}

/*export function poolGetProportionalExitAmountsForBptIn(
    bptInHumanReadable: AmountHumanReadable,
    poolTokens: GqlPoolTokenBase[],
    poolTotalShares: AmountHumanReadable,
    isStable?: boolean,
): TokenAmountHumanReadable[] {
    const bptInAmountScaled = oldBnumScale(bptInHumanReadable, 18);
    const bptTotalSupply = oldBnumScale(poolTotalShares, 18);
    const balancesScaled = poolTokens.map((token) =>
        isStable ? scaleTo18AndApplyPriceRate(token.totalBalance, token) : oldBnumScale(token.totalBalance, 18),
    );

    const amountsOut = isStable
        ? SDK.StableMath._calcTokensOutGivenExactBptIn(balancesScaled, bptInAmountScaled, bptTotalSupply)
        : SDK.WeightedMath._calcTokensOutGivenExactBptIn(balancesScaled, bptInAmountScaled, bptTotalSupply);

    return poolTokens.map((token, index) => {
        const downscaledAmount = removePriceRateFromAmount(amountsOut[index].toString(), token);

        return {
            address: token.address,
            amount: formatUnits(downscaledAmount.toString(), token.decimals),
        };
    });
}*/

export function poolGetProportionalExitAmountsForBptIn(
    bptInHumanReadable: AmountHumanReadable,
    poolTokens: GqlPoolTokenBase[],
    poolTotalShares: AmountHumanReadable,
    isStable?: boolean,
): TokenAmountHumanReadable[] {
    const bptInAmountScaled = parseUnits(bptInHumanReadable, 18);
    const bptTotalSupply = parseUnits(poolTotalShares, 18);

    return poolTokens.map((token) => {
        const tokenBalance = parseUnits(token.totalBalance, token.decimals);
        const tokenProportionalAmount = bptInAmountScaled.mul(tokenBalance).div(bptTotalSupply);

        return {
            address: token.address,
            amount: formatUnits(tokenProportionalAmount, token.decimals),
        };
    });
}

export function poolScaleSlippage(slippage: number | string) {
    return `${oldBnumScale(`${slippage}`, 18).toFixed(0)}`;
}

export function poolGetEthAmountFromJoinData(
    data: PoolJoinExactTokensInForBPTOut,
    wethAddress: string,
): { ethAmount: AmountHumanReadable | undefined; ethAmountScaled: AmountScaledString } {
    const ethAmount = data.wethIsEth
        ? data.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === wethAddress)
        : undefined;
    const ethAmountScaled = (ethAmount ? parseUnits(ethAmount.amount, 18) : Zero).toString();

    return { ethAmount: ethAmount?.amount, ethAmountScaled };
}

export function poolStableExactTokensInForBPTOut(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): OldBigNumber {
    try {
        return SDK.StableMath._calcBptOutGivenExactTokensIn(
            oldBnumFromBnum(poolScaleAmp(pool.amp)),
            pool.tokens.map((token) => scaleTo18AndApplyPriceRate(token.totalBalance, token)),
            pool.tokens.map((poolToken) => {
                const tokenAmount = tokenAmounts.find((amount) => amount.address === poolToken.address);

                return tokenAmount ? scaleTo18AndApplyPriceRate(tokenAmount.amount, poolToken) : oldBnumZero();
            }),
            oldBnumScaleAmount(poolGetTotalShares(pool)),
            oldBnumScaleAmount(poolGetSwapFee(pool)),
        );
    } catch (error) {
        console.error(error);

        return oldBnumZero();
    }
}

export function poolStableBptForTokensZeroPriceImpact(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): OldBigNumber {
    const priceRatesScaled = pool.tokens.map((token) => parseUnits(token.priceRate, 18));

    const denormAmounts = pool.tokens.map((token, index) => {
        const tokenAmount = tokenAmounts.find((amount) => token.address === amount.address);

        return (
            parseUnits(tokenAmount?.amount || '0', token?.decimals || 18)
                //apply the price rate to the amounts
                .mul(priceRatesScaled[index].toString())
                .div(WeiPerEther)
        );
    });

    // _bptForTokensZeroPriceImpact is the only stable pool function
    // that requires balances be scaled by the tokenWithAmount decimals and not 18
    const balances = pool.tokens.map((token, index) =>
        parseUnits(token.totalBalance, token.decimals)
            //apply the price rate to the balances
            .mul(priceRatesScaled[index].toString())
            .div(WeiPerEther),
    );

    const bptZeroImpact = stableBPTForTokensZeroPriceImpact(
        balances,
        pool.tokens.map((token) => token.decimals),
        denormAmounts,
        oldBnumScaleAmount(poolGetTotalShares(pool)).toString(),
        poolScaleAmp(pool.amp).toString(),
    );

    return oldBnumFromBnum(bptZeroImpact);
}

export function poolWeightedExactTokensInForBPTOut(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolWeighted,
): OldBigNumber {
    return SDK.WeightedMath._calcBptOutGivenExactTokensIn(
        pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals)),
        pool.tokens.map((token) => oldBnumScaleAmount(token.weight || '0', 18)),
        oldBnumPoolScaleTokenAmounts(tokenAmounts, pool.tokens),
        oldBnumScaleAmount(pool.dynamicData.totalShares),
        oldBnumScaleAmount(pool.dynamicData.swapFee),
    );
}

export function poolWeightedBptForTokensZeroPriceImpact(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolWeighted,
): OldBigNumber {
    const denormAmounts = oldBnumPoolScaleTokenAmounts(tokenAmounts, pool.tokens);
    const tokenBalancesScaled = pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals));
    const tokenWeightsScaled = pool.tokens.map((token) => oldBnumScaleAmount(token.weight || '0', 18));

    const result = weightedBPTForTokensZeroPriceImpact(
        tokenBalancesScaled.map((balance) => oldBnumToBnum(balance)),
        pool.tokens.map((token) => token.decimals),
        tokenWeightsScaled.map((weight) => oldBnumToBnum(weight)),
        denormAmounts.map((amount) => oldBnumToBnum(amount)),
        parseUnits(pool.dynamicData.totalShares),
    );

    return oldBnumFromBnum(result);
}

export function scaleTo18AndApplyPriceRate(amount: AmountHumanReadable, token: GqlPoolTokenBase): OldBigNumber {
    const denormAmount = oldBnum(parseUnits(amount, 18).toString())
        .times(token.priceRate)
        .toFixed(0, OldBigNumber.ROUND_UP);

    return oldBnum(denormAmount);
}

export function removePriceRateFromAmount(amount: AmountScaledString, token: GqlPoolTokenBase): OldBigNumber {
    const denormAmount = oldBnum(amount).div(token.priceRate).toFixed(0, OldBigNumber.ROUND_UP);

    return oldBnum(denormAmount);
}

export function poolBatchSwaps(assets: string[][], swaps: SwapV2[][]): { swaps: SwapV2[]; assets: string[] } {
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

export async function poolQueryBatchSwap({
    provider,
    swaps,
    swapType,
    assets,
}: {
    provider: BaseProvider;
    swapType: SwapTypes;
    swaps: SwapV2[];
    assets: string[];
}): Promise<string[]> {
    const vaultContract = new Contract(networkConfig.balancer.vault, VaultAbi, provider);
    const funds: FundManagement = {
        sender: AddressZero,
        recipient: AddressZero,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    const response = await vaultContract.queryBatchSwap(swapType, swaps, assets, funds);

    return response.map((item: BigNumber) => item.toString());
}

export function poolWeightedExactBPTInForTokenOut(
    pool: GqlPoolWeighted,
    bptAmount: AmountHumanReadable,
    tokenAddress: string,
): AmountHumanReadable {
    const token = poolGetRequiredToken(tokenAddress, pool.tokens);
    const tokenBalance = oldBnumScaleAmount(token.balance, token.decimals);
    const tokenNormalizedWeight = oldBnum(token.weight ? parseUnits(token.weight).toString() : '0');
    const bptAmountIn = oldBnumScaleAmount(bptAmount);

    const tokenOut = SDK.WeightedMath._calcTokenOutGivenExactBptIn(
        tokenBalance,
        tokenNormalizedWeight,
        bptAmountIn,
        oldBnumScaleAmount(pool.dynamicData.totalShares),
        oldBnumScaleAmount(pool.dynamicData.swapFee),
    );

    return formatFixed(tokenOut.toString(), token.decimals);
}

export function poolWeightedBptInForExactTokenOut(
    pool: GqlPoolWeighted,
    tokenAmountOut: TokenAmountHumanReadable,
): AmountHumanReadable {
    const token = poolGetRequiredToken(tokenAmountOut.address, pool.tokens);
    const tokenBalance = oldBnumScaleAmount(token.balance, token.decimals);
    const tokenNormalizedWeight = oldBnum(token.weight ? parseUnits(token.weight).toString() : '0');
    const amountOut = oldBnumScaleAmount(tokenAmountOut.amount, token.decimals);

    const bptIn = SDK.WeightedMath._calcBptInGivenExactTokenOut(
        tokenBalance,
        tokenNormalizedWeight,
        amountOut,
        oldBnumScaleAmount(pool.dynamicData.totalShares),
        oldBnumScaleAmount(pool.dynamicData.swapFee),
    );

    return formatFixed(bptIn.toString(), 18);
}

export function poolStableExactBPTInForTokenOut(
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
    bptAmount: AmountHumanReadable,
    tokenAddress: string,
): AmountHumanReadable {
    if (oldBnum(bptAmount).eq(0)) {
        return '0';
    }

    const token = poolGetRequiredToken(tokenAddress, pool.tokens);
    const bptAmountScaled = oldBnumScaleAmount(bptAmount);

    const tokenAmountOut = SDK.StableMath._calcTokenOutGivenExactBptIn(
        oldBnumFromBnum(poolScaleAmp(pool.amp)),
        pool.tokens.map((token) => scaleTo18AndApplyPriceRate(token.totalBalance, token)),
        pool.tokens.findIndex((poolToken) => poolToken.address === tokenAddress),
        bptAmountScaled,
        oldBnumScaleAmount(poolGetTotalShares(pool)),
        oldBnumScaleAmount(poolGetSwapFee(pool)),
    );

    const scaledTokenAmountOut = scaleTokenAmountDownFrom18Decimals(token, tokenAmountOut, OldBigNumber.ROUND_DOWN);

    return formatFixed(scaledTokenAmountOut.toString(), token.decimals);
}

export function poolStableBptInForExactTokenOut(
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
    tokenAmountOut: TokenAmountHumanReadable,
): AmountHumanReadable {
    const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
        oldBnumFromBnum(poolScaleAmp(pool.amp)),
        pool.tokens.map((token) => scaleTo18AndApplyPriceRate(token.totalBalance, token)),
        pool.tokens.map((poolToken) => {
            if (poolToken.address === tokenAmountOut.address) {
                return scaleTo18AndApplyPriceRate(tokenAmountOut.amount, poolToken);
            }

            return oldBnumZero();
        }),
        oldBnumScaleAmount(poolGetTotalShares(pool)),
        oldBnumScaleAmount(poolGetSwapFee(pool)),
    );

    return formatFixed(bptIn.toString(), 18);
}

export function poolGetNestedLinearPoolTokens(pool: PoolWithPossibleNesting): GqlPoolTokenLinear[] {
    const tokens: GqlPoolTokenLinear[] = [];

    for (const poolToken of pool.tokens) {
        if (poolToken.__typename === 'GqlPoolTokenLinear') {
            tokens.push(poolToken);
        }

        if ('pool' in poolToken) {
            for (const nestedPoolToken of poolToken.pool.tokens) {
                if (nestedPoolToken.__typename === 'GqlPoolTokenLinear') {
                    tokens.push(nestedPoolToken);
                }
            }
        }
    }

    return tokens;
}

export function poolGetNestedStablePoolTokens(pool: PoolWithPossibleNesting): GqlPoolTokenPhantomStable[] {
    const tokens: GqlPoolTokenPhantomStable[] = [];

    for (const poolToken of pool.tokens) {
        if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
            tokens.push(poolToken);
        }
    }

    return tokens;
}

export function poolGetMainTokenFromLinearPoolToken(linearPoolToken: GqlPoolTokenLinear): GqlPoolToken {
    const mainToken = linearPoolToken.pool.tokens.find((token) => token.index === linearPoolToken.pool.mainIndex);

    if (!mainToken) {
        throw new Error('Linear pool missing main token');
    }

    return mainToken;
}

export function poolGetWrappedTokenFromLinearPoolToken(linearPoolToken: GqlPoolTokenLinear): GqlPoolToken {
    const wrappedToken = linearPoolToken.pool.tokens.find((token) => token.index === linearPoolToken.pool.wrappedIndex);

    if (!wrappedToken) {
        throw new Error('Linear pool missing main token');
    }

    return wrappedToken;
}

export function poolGetTotalShares(
    pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): AmountHumanReadable {
    return pool.__typename === 'GqlPoolPhantomStableNested' ? pool.totalShares : pool.dynamicData.totalShares;
}

export function poolGetSwapFee(
    pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): AmountHumanReadable {
    return pool.__typename === 'GqlPoolPhantomStableNested' ? pool.swapFee : pool.dynamicData.swapFee;
}

function scaleTokenAmountDownFrom18Decimals(
    token: GqlPoolTokenBase,
    tokenAmount18decimals: OldBigNumber,
    rounding: OldBigNumber.RoundingMode,
): OldBigNumber {
    const amountAfterPriceRate = oldBnum(tokenAmount18decimals).div(token.priceRate).toString();

    const normalizedAmount = oldBnum(amountAfterPriceRate)
        .div(parseUnits('1', 18).toString())
        .toFixed(token.decimals, rounding);
    const scaledAmount = parseUnits(normalizedAmount, token.decimals);

    return oldBnum(scaledAmount.toString());
}

export function poolGetPoolTokenForPossiblyNestedTokenOut(
    pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested | GqlPoolLinearNested,
    tokenOutAddress: string,
) {
    return pool.tokens.find((poolToken) => {
        if (poolToken.address === tokenOutAddress) {
            return true;
        }

        if (poolToken.__typename === 'GqlPoolTokenLinear') {
            return !!poolToken.pool.tokens.find((linearPoolToken) => linearPoolToken.address === tokenOutAddress);
        } else if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
            const nestedPoolToken = poolToken.pool.tokens.find((nestedPoolToken) => {
                if (nestedPoolToken.__typename === 'GqlPoolTokenLinear') {
                    return nestedPoolToken.pool.tokens.find(
                        (linearPoolToken) => linearPoolToken.address === tokenOutAddress,
                    );
                }

                return nestedPoolToken.address === tokenOutAddress;
            });

            return !!nestedPoolToken;
        }
    });
}

export function poolHasOnlyLinearBpts(pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested) {
    for (const token of pool.tokens) {
        if (token.__typename !== 'GqlPoolTokenLinear') {
            return false;
        }
    }

    return true;
}

export function poolGetNestedTokenEstimateForPoolTokenAmounts({
    pool,
    poolTokenAmounts,
    nestedTokens,
}: {
    pool: PoolWithPossibleNesting;
    poolTokenAmounts: TokenAmountHumanReadable[];
    nestedTokens: string[];
}): TokenAmountHumanReadable[] {
    const nestedStablePoolTokens = poolGetNestedStablePoolTokens(pool);
    const nestedLinearPoolTokens = poolGetNestedLinearPoolTokens(pool);
    let tokenAmountsOut = poolTokenAmounts.filter((amountOut) => nestedTokens.includes(amountOut.address));
    let bptAmounts = poolTokenAmounts.filter((amountOut) => !nestedTokens.includes(amountOut.address));

    for (const nestedStablePoolToken of nestedStablePoolTokens) {
        const nestedStablePool = nestedStablePoolToken.pool;
        //assuming a proportional exit, there should always be an amount for this
        const bptAmount = bptAmounts.find((amount) => amount.address === nestedStablePoolToken.address)!;

        const nestedExitAmounts = poolGetProportionalExitAmountsForBptIn(
            bptAmount.amount,
            nestedStablePool.tokens,
            poolGetTotalShares(nestedStablePool),
            true,
        );

        tokenAmountsOut = tokenAmountsOut.concat(
            nestedExitAmounts.filter((amountOut) => nestedTokens.includes(amountOut.address)),
        );
        bptAmounts = bptAmounts.concat(
            nestedExitAmounts.filter((amountOut) => !nestedTokens.includes(amountOut.address)),
        );
    }

    for (const linearPoolToken of nestedLinearPoolTokens) {
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

export function tokenAmountsAllZero(tokenAmounts: TokenAmountHumanReadable[]) {
    return tokenAmounts.filter((amount) => parseFloat(amount.amount) === 0).length === tokenAmounts.length;
}
