import {
    GqlPoolComposableStableNested,
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
import { PoolComposableStableService } from '~/lib/services/pool/pool-composable-stable.service';
import { PoolWeightedV2Service } from '~/lib/services/pool/pool-weighted-v2.service';
import { PoolGyroService } from './pool-gyro.service';

export function poolGetTokensWithoutPhantomBpt(pool: GqlPoolUnion | GqlPoolComposableStableNested) {
    return pool.tokens.filter((token) => token.address !== pool.address);
}

export function poolIsWeightedLikePool(pool: GqlPoolUnion) {
    return pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolLiquidityBootstrapping';
}

export function poolIsTokenPhantomBpt(poolToken: GqlPoolTokenUnion) {
    return poolToken.__typename === 'GqlPoolTokenComposableStable';
}

export function poolIsComposablePool(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' && pool.version >= 2) ||
        (pool.__typename === 'GqlPoolComposableStable' && pool.version > 0)
    );
}

export function poolRequiresBatchRelayerOnJoin(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')) ||
        poolIsComposablePool(pool)
    );
}

export function poolRequiresBatchRelayerOnExit(pool: GqlPoolUnion) {
    return (
        (pool.__typename === 'GqlPoolWeighted' &&
            (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')) ||
        poolIsComposablePool(pool)
    );
}

export function poolGetServiceForPool(pool: GqlPoolUnion): PoolService {
    switch (pool.__typename) {
        case 'GqlPoolWeighted': {
            if (pool.version >= 2) {
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
        case 'GqlPoolComposableStable': {
            if (pool.version > 0) {
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
        case 'GqlPoolGyro':
            return new PoolGyroService(pool, batchRelayerService, networkConfig.wethAddress);
    }

    throw new Error('unsupported pool type');
}

export function poolGetTypeName(pool: GqlPoolUnion) {
    switch (pool.__typename) {
        case 'GqlPoolWeighted':
            return 'Weighted pool';
        case 'GqlPoolStable':
            return 'Stable pool';
        case 'GqlPoolComposableStable':
            return 'ComposableStable pool';
        case 'GqlPoolLiquidityBootstrapping':
            return 'Liquidity bootstrapping pool';
        case 'GqlPoolMetaStable':
            return 'MetaStable pool';
        case 'GqlPoolGyro':
            switch (pool.type) {
                case 'GYRO':
                    return 'Gyro 2CLP';
                case 'GYRO3':
                    return 'Gyro 3CLP';
                case 'GYROE':
                    return 'Gyro ECLP';
            }
        default:
            return 'unknown';
    }
}

export function isReaperLinearPool(factoryAddress: string | undefined | null) {
    return networkConfig.balancer.linearFactories.reaper.includes((factoryAddress || '').toLowerCase());
}
