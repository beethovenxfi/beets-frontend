import {
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
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

export function poolGetTokensWithoutPhantomBpt(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
    return pool.tokens.filter((token) => token.address !== pool.address);
}

export function poolIsWeightedLikePool(pool: GqlPoolUnion) {
    return pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolLiquidityBootstrapping';
}

export function poolRequiresBatchRelayerOnJoin(pool: GqlPoolUnion) {
    return (
        pool.__typename === 'GqlPoolWeighted' &&
        (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT')
    );
}

export function poolGetServiceForPool(pool: GqlPoolUnion): PoolService {
    switch (pool.__typename) {
        case 'GqlPoolWeighted': {
            if (pool.nestingType === 'HAS_SOME_PHANTOM_BPT' || pool.nestingType === 'HAS_ONLY_PHANTOM_BPT') {
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
        case 'GqlPoolPhantomStable':
            return new PoolPhantomStableService(pool, batchRelayerService, networkConfig.wethAddress, networkProvider);
    }

    throw new Error('unsupported pool type');
}
