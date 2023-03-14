import {
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolTokenUnion,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { AdditionalPoolData, PoolService, TotalSupplyType } from '~/lib/services/pool/pool-types';
import { PoolStableService } from '~/lib/services/pool/pool-stable.service';
import { PoolPhantomStableService } from '~/lib/services/pool/pool-phantom-stable.service';
import { PoolWeightedService } from '~/lib/services/pool/pool-weighted.service';
import { PoolWeightedBoostedService } from '~/lib/services/pool/pool-weighted-boosted.service';
import { batchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { networkConfig } from '~/lib/config/network-config';
import { networkProvider } from '~/lib/global/network';
import { PoolMetaStableService } from '~/lib/services/pool/pool-meta-stable.service';
import { isSameAddress } from '@balancer-labs/sdk';
import { PoolComposableStableService } from '~/lib/services/pool/pool-composable-stable.service';
import { PoolWeightedV2Service } from '~/lib/services/pool/pool-weighted-v2.service';
import BalancerSorQueriesAbi from '~/lib/abi/BalancerSorQueries.json';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { formatFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';
import u from 'updeep';

export function poolGetTokensWithoutPhantomBpt(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
    return pool.tokens.filter((token) => token.address !== pool.address);
}

export function poolIsWeightedLikePool(pool: GqlPoolUnion) {
    return pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolLiquidityBootstrapping';
}

export function poolIsTokenPhantomBpt(poolToken: GqlPoolTokenUnion) {
    return poolToken.__typename === 'GqlPoolTokenLinear' || poolToken.__typename === 'GqlPoolTokenPhantomStable';
}

export function poolRequiresBatchRelayerOnJoin(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')) ||
        pool.factory === networkConfig.balancer.composableStableFactory
    );
}

export function poolRequiresBatchRelayerOnExit(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')) ||
        pool.factory === networkConfig.balancer.composableStableFactory ||
        pool.factory === networkConfig.balancer.weightedPoolV2Factory
    );
}

export function poolIsComposablePool(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            isSameAddress(pool.factory || '', networkConfig.balancer.weightedPoolV2Factory)) ||
        (pool.__typename === 'GqlPoolPhantomStable' &&
            isSameAddress(pool.factory || '', networkConfig.balancer.composableStableFactory))
    );
}

export function poolGetServiceForPool(pool: GqlPoolUnion): PoolService {
    switch (pool.__typename) {
        case 'GqlPoolWeighted': {
            if (isSameAddress(pool.factory || '', networkConfig.balancer.weightedPoolV2Factory)) {
                return new PoolWeightedV2Service(pool, batchRelayerService, networkConfig.wethAddress, networkProvider);
            } else if (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT') {
                return new PoolWeightedBoostedService(
                    pool,
                    batchRelayerService,
                    networkConfig.wethAddress,
                    networkProvider,
                );
            }

            return new PoolWeightedService(pool, batchRelayerService, networkConfig.wethAddress);
        }
        case 'GqlPoolStable':
            return new PoolStableService(pool, batchRelayerService, networkConfig.wethAddress);
        case 'GqlPoolPhantomStable': {
            if (isSameAddress(pool.factory || '', networkConfig.balancer.composableStableFactory)) {
                return new PoolComposableStableService(
                    pool,
                    batchRelayerService,
                    networkConfig.wethAddress,
                    networkProvider,
                );
            }

            return new PoolPhantomStableService(pool, batchRelayerService, networkConfig.wethAddress, networkProvider);
        }
        case 'GqlPoolMetaStable':
            return new PoolMetaStableService(pool, batchRelayerService, networkConfig.wethAddress);
    }

    throw new Error('unsupported pool type');
}

export function poolGetTypeName(pool: GqlPoolUnion) {
    switch (pool.__typename) {
        case 'GqlPoolWeighted':
            return 'Weighted pool';
        case 'GqlPoolStable':
            return 'Stable pool';
        case 'GqlPoolPhantomStable':
            return 'Stable phantom pool';
        case 'GqlPoolLiquidityBootstrapping':
            return 'Liquidity bootstrapping pool';
        case 'GqlPoolMetaStable':
            return 'MetaStable pool';
        default:
            return 'unknown';
    }
}

export function isReaperLinearPool(factoryAddress: string | undefined | null) {
    return networkConfig.balancer.linearFactories.reaper.includes((factoryAddress || '').toLowerCase());
}

export function hasSmallWrappedBalancedIn18Decimals(
    pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested,
) {
    if (pool.__typename == 'GqlPoolLinear' || pool.__typename === 'GqlPoolLinearNested') {
        const mainToken = pool.tokens.find((token) => token.index === pool.mainIndex);

        return isReaperLinearPool(pool.factory) && mainToken && mainToken.decimals < 18;
    }

    return false;
}

export function getLinearPoolMainToken(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
    if (pool.__typename == 'GqlPoolLinear' || pool.__typename === 'GqlPoolLinearNested') {
        const mainToken = pool.tokens.find((token) => token.index === pool.mainIndex);

        return mainToken || null;
    }

    return null;
}

function getTotalSupplyType(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested): TotalSupplyType {
    const isPhantomStable = ['GqlPoolPhantomStable', 'GqlPoolPhantomStableNested'].includes(pool.__typename);
    const hasComposableStableFactory = isSameAddress(
        pool.factory || '',
        networkConfig.balancer.composableStableFactory,
    );

    if (
        (pool.__typename === 'GqlPoolWeighted' &&
            isSameAddress(pool.factory || '', networkConfig.balancer.weightedPoolV2Factory)) ||
        (isPhantomStable && hasComposableStableFactory)
    ) {
        return TotalSupplyType.ACTUAL_SUPPLY;
    } else if (
        (isPhantomStable && !hasComposableStableFactory) ||
        ['GqlPoolLinear', 'GqlPoolLinearNested'].includes(pool.__typename)
    ) {
        return TotalSupplyType.VIRTUAL_SUPPLY;
    } else {
        return TotalSupplyType.TOTAL_SUPPLY;
    }
}

export async function poolGetPoolData({
    provider,
    poolIds,
    totalSupplyTypes,
}: {
    provider: BaseProvider;
    poolIds: string[];
    totalSupplyTypes: TotalSupplyType[];
}): Promise<AdditionalPoolData<BigNumber[]>> {
    const sorQueriesContract = new Contract(networkConfig.balancer.sorQueries, BalancerSorQueriesAbi, provider);
    const defaultPoolDataQueryConfig = {
        loadTokenBalanceUpdatesAfterBlock: false,
        loadTotalSupply: false,
        loadSwapFees: false,
        loadLinearWrappedTokenRates: false,
        loadNormalizedWeights: false,
        loadScalingFactors: false,
        loadAmps: false,
        blockNumber: 0,
        totalSupplyTypes: [],
        swapFeeTypes: [],
        linearPoolIdxs: [],
        weightedPoolIdxs: [],
        scalingFactorPoolIdxs: [],
        ampPoolIdxs: [],
    };

    const response = await sorQueriesContract.getPoolData(poolIds, {
        ...defaultPoolDataQueryConfig,
        loadTokenBalanceUpdatesAfterBlock: true,
        loadTotalSupply: true,
        totalSupplyTypes,
    });

    return {
        balances: response[0],
        totalSupplies: response[1],
        swapFees: response[2],
        linearWrappedTokenRates: response[3],
        weights: response[4],
        scalingFactors: response[5],
        amps: response[6],
    };
}

export function getPoolIdsAndTotalSupplyTypes(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested): {
    poolIds: string[];
    totalSupplyTypes: TotalSupplyType[];
} {
    let poolIds: string[] = [];
    let totalSupplyTypes: TotalSupplyType[] = [];

    let traverse = (pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) => {
        poolIds.push(pool.id);
        totalSupplyTypes.push(getTotalSupplyType(pool));
        for (let token of pool.tokens) {
            if ('pool' in token) traverse(token.pool);
        }
    };

    traverse(pool);
    return { poolIds, totalSupplyTypes };
}

export function updateBalances(
    poolIds: string[],
    pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested,
    poolData: AdditionalPoolData<string[]> | undefined,
) {
    if (!poolData || !poolIds) {
        return;
    }

    const { balances, totalSupplies } = poolData;

    // keep track of where we are and push the complete path to updates
    let depth = 1;
    let lastDepth = 1;
    let updatePath: string[] = [];
    let updates: any[] = []; // TODO: type this

    // keep track of some values for nested pool balances
    let parentTokenBalances: string[] = [];
    let totalSharesValue: string;
    let totalSharesValues: string[] = [];

    let traverse = (pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) => {
        const poolIdIdx = poolIds.findIndex((id) => id === pool.id);
        const hasTotalShares = 'totalShares' in pool;

        if (hasTotalShares) {
            const totalSharesPath = [...updatePath, 'pool', 'totalShares'].join('.');
            totalSharesValue = formatFixed(totalSupplies[poolIdIdx], 18);
            updates.push({ path: totalSharesPath, value: totalSharesValue });
            // remember the value for later use
            totalSharesValues.push(totalSharesValue);
        }

        pool.tokens.forEach((token, tokenIdx) => {
            // at the top level just push 'tokens.<tokenIdx>' or drop everything when coming back to it
            if (depth === 1) {
                if (updatePath.length) {
                    updatePath = [];
                }
                updatePath.push('tokens', tokenIdx.toString());

                // drop the last '<parentTokenIdx>.pool.tokens.<tokenIdx>' and add the next '<tokenIdx>' when going up a level
            } else if (lastDepth > depth) {
                updatePath.splice(-4);
                updatePath.push(tokenIdx.toString());

                // keep adding 'pool.tokens.<tokenIdx>' as we go all the way down
            } else if (updatePath[updatePath.length - 1] === tokenIdx.toString()) {
                updatePath.push('pool', 'tokens', tokenIdx.toString());

                // back down a level through the next branch
            } else if (
                depth > lastDepth &&
                updatePath[updatePath.length - 1] !== tokenIdx.toString() &&
                updatePath.length < depth * 3 - 1
            ) {
                updatePath.push('pool', 'tokens', tokenIdx.toString());

                // at the leaves we just swap '<tokenIdx>' for the next one
            } else {
                updatePath.splice(-1);
                updatePath.push(tokenIdx.toString());
            }

            const totalBalancePath = [...updatePath, 'totalBalance'].join('.');
            const balancePath = [...updatePath, 'balance'].join('.');
            const balanceObj = balances[poolIdIdx].map((balance, balanceIdx) => {
                if (token.index === balanceIdx) {
                    const balanceValue = formatFixed(balance, token.decimals);

                    // use the last stored values to calculate the percentage of nested supply
                    const nestedBalanceValue = (
                        (parseFloat(parentTokenBalances[parentTokenBalances.length - 1]) /
                            parseFloat(totalSharesValues[totalSharesValues.length - 1])) *
                        parseFloat(balanceValue)
                    ).toString();

                    return [
                        { path: totalBalancePath, value: formatFixed(balance, token.decimals) },
                        { path: balancePath, value: hasTotalShares ? nestedBalanceValue : balanceValue },
                    ];
                } else {
                    return [];
                }
            });

            updates.push(balanceObj);
            if ('pool' in token) {
                lastDepth = depth++;
                // remember the value for later use
                parentTokenBalances.push(token.balance);

                traverse(token.pool);

                lastDepth = depth--;
                // done with the level so dump the last values
                parentTokenBalances.pop();
                totalSharesValues.pop();
            }
        });
    };

    traverse(pool);

    // completely flatten the updates array
    updates = updates.flat(2);

    let updatedPool = pool;
    // cycle through the updates array and use updeep to update the values
    updates.forEach((update) => (updatedPool = u.updateIn(update.path, update.value, updatedPool)));

    return updatedPool as GqlPoolUnion;
}
