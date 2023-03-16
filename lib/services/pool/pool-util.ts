import {
    GqlPoolLinear,
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolTokenUnion,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { PoolService } from '~/lib/services/pool/pool-types';
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
        networkConfig.balancer.composableStableFactories.includes(pool.factory || '')
    );
}

export function poolRequiresBatchRelayerOnExit(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')) ||
        networkConfig.balancer.composableStableFactories.includes(pool.factory || '') ||
        pool.factory === networkConfig.balancer.weightedPoolV2Factory
    );
}

export function poolIsComposablePool(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            isSameAddress(pool.factory || '', networkConfig.balancer.weightedPoolV2Factory)) ||
        (pool.__typename === 'GqlPoolPhantomStable' &&
            networkConfig.balancer.composableStableFactories.includes(pool.factory || ''))
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
            if (networkConfig.balancer.composableStableFactories.includes(pool.factory || '')) {
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
