import { createContext, useContext, useEffect, useMemo } from 'react';
import { GqlPoolUnion, useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { poolGetServiceForPool, poolGetTypeName, poolRequiresBatchRelayerOnJoin } from '~/lib/services/pool/pool-util';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { PoolService } from '~/lib/services/pool/pool-types';
import { TokenBase } from '~/lib/services/token/token-types';
import { uniqBy } from 'lodash';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export interface PoolContextType {
    pool: GqlPoolUnion;
    poolService: PoolService;
    bpt: TokenBase;
    bptPrice: number;
    allTokens: TokenBase[];
    allTokenAddresses: string[];
    requiresBatchRelayerOnJoin: boolean;
    supportsZap: boolean;
    formattedTypeName: string;
    totalApr: number;
    isFbeetsPool: boolean;
    isStablePool: boolean;
}

export const PoolContext = createContext<PoolContextType | null>(null);

export function PoolProvider({ pool: poolFromProps, children }: { pool: GqlPoolUnion; children: any }) {
    const networkConfig = useNetworkConfig();
    const { data, networkStatus, startPolling, refetch } = useGetPoolQuery({
        variables: { id: poolFromProps.id },
        notifyOnNetworkStatusChange: true,
    });

    const pool = data?.pool || poolFromProps;
    const poolService = poolGetServiceForPool(pool);

    const bpt: TokenBase = {
        address: pool.address,
        symbol: pool.symbol,
        name: pool.name,
        decimals: pool.decimals,
    };
    const bptPrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);

    const requiresBatchRelayerOnJoin = poolRequiresBatchRelayerOnJoin(pool);
    const supportsZap =
        (pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolStable') &&
        pool.staking?.type === 'MASTER_CHEF' &&
        !!pool.staking.farm;

    const allTokens = useMemo(
        () =>
            uniqBy(
                [
                    ...pool.allTokens,
                    bpt,
                    ...pool.investConfig.options.flatMap((option) => option.tokenOptions),
                    ...pool.withdrawConfig.options.flatMap((option) => option.tokenOptions),
                ],
                'address',
            ),
        [pool.id],
    );

    const isStablePool =
        pool.__typename === 'GqlPoolStable' ||
        pool.__typename === 'GqlPoolPhantomStable' ||
        pool.__typename === 'GqlPoolMetaStable';

    useEffectOnce(() => {
        refetch();
        startPolling(30_000);
    });

    useEffect(() => {
        poolService.updatePool(pool);
    }, [networkStatus]);

    return (
        <PoolContext.Provider
            value={{
                pool,
                poolService,
                bpt,
                allTokens,
                allTokenAddresses: allTokens.map((token) => token.address),
                requiresBatchRelayerOnJoin,
                bptPrice,
                supportsZap,
                formattedTypeName: poolGetTypeName(pool),
                totalApr: parseFloat(pool.dynamicData.apr.total),
                isFbeetsPool: pool.id === networkConfig.fbeets.poolId,
                isStablePool,
            }}
        >
            {children}
        </PoolContext.Provider>
    );
}

export function usePool() {
    //we force cast here because the context will never be null
    return useContext(PoolContext) as PoolContextType;
}
