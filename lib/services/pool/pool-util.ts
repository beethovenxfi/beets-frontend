import {
    GqlPoolBase,
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolToken,
    GqlPoolTokenLinear,
    GqlPoolTokenPhantomStableNestedUnion,
    GqlPoolTokenUnion,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { PoolService } from '~/lib/services/pool/pool-types';
import { PoolStableService } from '~/lib/services/pool/pool-stable.service';
import { PoolPhantomStableService } from '~/lib/services/pool/pool-phantom-stable.service';
import { PoolWeightedService } from '~/lib/services/pool/pool-weighted.service';
import { PoolWeightedBoostedService } from '~/lib/services/pool/pool-weighted-boosted.service';
import { rpcProviderService } from '~/lib/services/rpc-provider/rpc-provider.service';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { SwapV2 } from '@balancer-labs/sdk';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import OldBigNumber from 'bignumber.js';

export function poolGetTokensWithoutPhantomBpt(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
    return pool.tokens.filter((token) => token.address !== pool.address);
}

export function poolIsWeightedLikePool(pool: GqlPoolUnion) {
    return pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolLiquidityBootstrapping';
}

export function poolGetServiceForPool(pool: GqlPoolUnion): PoolService {
    switch (pool.__typename) {
        case 'GqlPoolWeighted': {
            if (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT') {
                return new PoolWeightedBoostedService(pool);
            }

            return new PoolWeightedService(pool);
        }
        case 'GqlPoolStable':
            return new PoolStableService(pool);
        case 'GqlPoolPhantomStable':
            return new PoolPhantomStableService(pool, rpcProviderService.getJsonProvider());
    }

    throw new Error('unsupported pool type');
}

export function poolGetJoinSwaps({
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

        const { swaps, assets } = poolGetJoinSwaps({
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
