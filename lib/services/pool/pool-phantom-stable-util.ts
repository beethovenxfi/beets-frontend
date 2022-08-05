import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    GqlPoolInvestOption,
    GqlPoolTokenPhantomStableNestedUnion,
    GqlPoolTokenUnion,
    GqlPoolWithdrawOption,
} from '~/apollo/generated/graphql-codegen-generated';
import { FundManagement, isSameAddress, SwapV2 } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
import { BaseProvider } from '@ethersproject/providers';
import { SwapTypes } from '@balancer-labs/sor';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import OldBigNumber from 'bignumber.js';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { cloneDeep } from 'lodash';

export function poolGetJoinSwapForToken({
    poolId,
    poolAddress,
    tokenAmountIn,
    poolToken,
}: {
    poolId: string;
    poolAddress: string;
    tokenAmountIn: TokenAmountHumanReadable;
    poolToken: GqlPoolTokenUnion;
}): { swaps: SwapV2[]; assets: string[] } {
    const tokenIn = tokenAmountIn.address.toLowerCase();

    if (poolToken.address === tokenIn) {
        return {
            swaps: [
                {
                    poolId,
                    assetInIndex: 0,
                    assetOutIndex: 1,
                    amount: parseUnits(tokenAmountIn.amount, poolToken.decimals).toString(),
                    userData: '0x',
                },
            ],
            assets: [tokenIn, poolAddress],
        };
    } else if (poolToken.__typename === 'GqlPoolTokenLinear') {
        const nestedToken = poolToken.pool.tokens.find((token) => token.address === tokenIn);

        if (!nestedToken) {
            throw new Error(`Token does not exist in pool token: ${tokenIn}`);
        }

        return {
            swaps: [
                {
                    poolId: poolToken.pool.id,
                    assetInIndex: 0,
                    assetOutIndex: 1,
                    amount: parseUnits(tokenAmountIn.amount, nestedToken.decimals).toString(),
                    userData: '0x',
                },
                {
                    poolId,
                    assetInIndex: 1,
                    assetOutIndex: 2,
                    amount: '0',
                    userData: '0x',
                },
            ],
            assets: [nestedToken.address, poolToken.address, poolAddress],
        };
    } else if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
        const nestedPoolToken = poolFindNestedPoolTokenForToken(tokenIn, poolToken.pool.tokens);

        if (!nestedPoolToken) {
            throw new Error(`Token does not exist in pool token: ${tokenIn}`);
        }

        const { swaps, assets } = poolGetJoinSwapForToken({
            poolId: poolToken.pool.id,
            poolAddress: poolToken.pool.address,
            tokenAmountIn,
            poolToken: nestedPoolToken,
        });

        return {
            swaps: [
                ...swaps,
                {
                    poolId,
                    assetInIndex: assets.length - 1,
                    assetOutIndex: assets.length,
                    amount: '0',
                    userData: '0x',
                },
            ],
            assets: [...assets, poolAddress],
        };
    }

    throw new Error(`No available join swap path for poolId: ${poolId} and token: ${tokenIn}`);
}

export function poolGetExitSwaps({
    poolId,
    poolAddress,
    bptIn,
    poolToken,
    tokenOut,
}: {
    poolId: string;
    poolAddress: string;
    bptIn: AmountHumanReadable;
    tokenOut: string;
    poolToken: GqlPoolTokenUnion;
}): { swaps: SwapV2[]; assets: string[] } {
    const bptInScaled = parseUnits(bptIn, 18).toString();

    if (poolToken.address === tokenOut) {
        return {
            swaps: [{ poolId, assetInIndex: 0, assetOutIndex: 1, amount: bptInScaled, userData: '0x' }],
            assets: [poolAddress, tokenOut],
        };
    } else if (poolToken.__typename === 'GqlPoolTokenLinear') {
        const nestedToken = poolToken.pool.tokens.find((token) => token.address === tokenOut);

        if (!nestedToken) {
            throw new Error(`Token does not exist in pool token: ${tokenOut}`);
        }

        return {
            swaps: [
                { poolId, assetInIndex: 0, assetOutIndex: 1, amount: bptInScaled, userData: '0x' },
                { poolId: poolToken.pool.id, assetInIndex: 1, assetOutIndex: 2, amount: '0', userData: '0x' },
            ],
            assets: [poolAddress, poolToken.address, nestedToken.address],
        };
    } else if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
        const nestedPoolToken = poolFindNestedPoolTokenForToken(tokenOut, poolToken.pool.tokens);

        if (!nestedPoolToken) {
            throw new Error(`Token does not exist in pool token: ${tokenOut}`);
        }

        const { swaps, assets } = poolGetExitSwaps({
            poolId: poolToken.pool.id,
            poolAddress: poolToken.pool.address,
            bptIn: '0',
            poolToken: nestedPoolToken,
            tokenOut,
        });

        return {
            swaps: [
                {
                    poolId,
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
            assets: [poolAddress, ...assets],
        };
    }

    throw new Error(`No available join swap path for poolId: ${poolId} and token: ${tokenOut}`);
}

export function poolSumPoolTokenBalances(poolTokens: GqlPoolTokenUnion[]): OldBigNumber {
    let totalBalance = oldBnum(0);

    for (const token of poolTokens) {
        totalBalance = totalBalance.plus(token.balance);
    }

    return totalBalance;
}

export function poolFindNestedPoolTokenForToken(
    tokenAddress: string,
    poolTokens: GqlPoolTokenPhantomStableNestedUnion[],
) {
    const nestedPoolToken = poolTokens.find((token) => {
        if (token.__typename === 'GqlPoolTokenLinear') {
            return token.pool.tokens.find((linearPoolToken) => linearPoolToken.address === tokenAddress);
        }

        return token.address === tokenAddress;
    });

    if (!nestedPoolToken) {
        throw new Error('No nested pool token find for token address: ' + tokenAddress);
    }

    return nestedPoolToken;
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

export function poolFindPoolTokenFromOptions(
    tokenAddress: string,
    poolTokens: GqlPoolTokenUnion[],
    options: (GqlPoolWithdrawOption | GqlPoolInvestOption)[],
): GqlPoolTokenUnion {
    for (const option of options) {
        for (const tokenOption of option.tokenOptions) {
            if (isSameAddress(tokenAddress, tokenOption.address)) {
                const poolToken = poolTokens.find((token) => token.index === option.poolTokenIndex);

                if (poolToken) {
                    return poolToken;
                }
            }
        }
    }

    throw new Error(`Token was not found in the provided options: ${tokenAddress}`);
}
