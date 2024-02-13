import { createContext, useContext, useEffect, useMemo } from 'react';
import { GqlPoolUnion, useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import {
    poolGetServiceForPool,
    poolGetTypeName,
    poolIsComposablePool,
    poolRequiresBatchRelayerOnExit,
    poolRequiresBatchRelayerOnJoin,
} from '~/lib/services/pool/pool-util';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { PoolService } from '~/lib/services/pool/pool-types';
import { TokenBase } from '~/lib/services/token/token-types';
import { uniqBy } from 'lodash';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePoolWithOnChainData } from './usePoolWithOnChainData';

export interface PoolContextType {
    pool: GqlPoolUnion;
    poolService: PoolService;
    bpt: TokenBase;
    bptPrice: number;
    allTokens: TokenBase[];
    allTokenAddresses: string[];
    requiresBatchRelayerOnJoin: boolean;
    requiresBatchRelayerOnExit: boolean;
    supportsZap: boolean;
    formattedTypeName: string;
    totalApr: number;
    isFbeetsPool: boolean;
    isStablePool: boolean;
    isComposablePool: boolean;
    canCustomInvest: boolean;
}

export const PoolContext = createContext<PoolContextType | null>(null);

export function PoolProvider({ pool: poolFromProps, children }: { pool: GqlPoolUnion; children: any }) {
    const networkConfig = useNetworkConfig();
    const { data, networkStatus, startPolling, refetch } = useGetPoolQuery({
        variables: { id: poolFromProps.id },
        notifyOnNetworkStatusChange: true,
    });

    let pool = (data?.pool || poolFromProps) as GqlPoolUnion;

    // api needed to add bpts to tokens, filter them out again here
    // https://github.com/beethovenxfi/beethovenx-backend/pull/536
    pool = {
        ...pool,
        tokens: pool.tokens.filter((token) => token.address !== pool.address),
    } as GqlPoolUnion;

    // drop FTM as an invest option from the FreshBeets pool for now
    const freshBeetsPool: GqlPoolUnion | null = useMemo(() => {
        if (pool.address !== networkConfig.reliquary.fbeets.poolAddress) {
            return null;
        } else {
            const wFTMIndex = pool.investConfig.options.findIndex(
                (option) => option.poolTokenAddress.toLowerCase() === networkConfig.wethAddress,
            );
            const filteredTokenOptions = pool.investConfig.options[wFTMIndex].tokenOptions.filter(
                (option) => option.address.toLowerCase() !== networkConfig.eth.address.toLowerCase(),
            );
            return {
                ...pool,
                investConfig: {
                    ...pool.investConfig,
                    options: [
                        {
                            ...pool.investConfig.options[wFTMIndex],
                            tokenOptions: filteredTokenOptions,
                        },
                        ...pool.investConfig.options.filter((option, index) => index !== wFTMIndex),
                    ],
                },
            };
        }
    }, [pool.address]);

    const poolService = poolGetServiceForPool(pool);

    const { data: poolWithOnChainData } = usePoolWithOnChainData(pool);
    pool = poolWithOnChainData || pool;

    const bpt: TokenBase = {
        address: pool.address,
        symbol: pool.symbol,
        name: pool.name,
        decimals: pool.decimals,
    };
    const bptPrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);

    const isComposablePool = poolIsComposablePool(pool);
    const requiresBatchRelayerOnJoin = poolRequiresBatchRelayerOnJoin(pool);
    const requiresBatchRelayerOnExit = poolRequiresBatchRelayerOnExit(pool);
    const supportsZapIntoMasterchefFarm =
        (pool.__typename === 'GqlPoolWeighted' ||
            pool.__typename === 'GqlPoolStable' ||
            pool.__typename === 'GqlPoolMetaStable' ||
            (pool.__typename === 'GqlPoolComposableStable' && pool.version >= 4)) &&
        pool.staking?.type === 'MASTER_CHEF' &&
        !!pool.staking.farm;
    const supportsZapIntoGauge =
        ((pool.__typename === 'GqlPoolWeighted' && pool.version >= 2) ||
            pool.__typename === 'GqlPoolComposableStable' ||
            pool.__typename === 'GqlPoolMetaStable' ||
            pool.__typename === 'GqlPoolGyro') &&
        pool.staking?.type === 'GAUGE' &&
        !!pool.staking.gauge;
    const supportsZap = supportsZapIntoMasterchefFarm || supportsZapIntoGauge;

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
        pool.__typename === 'GqlPoolComposableStable' ||
        pool.__typename === 'GqlPoolMetaStable';

    const totalApr =
        pool.dynamicData.apr.apr.__typename === 'GqlPoolAprRange'
            ? parseFloat(pool.dynamicData.apr.apr.max)
            : parseFloat(pool.dynamicData.apr.apr.total);

    const canCustomInvest = pool.__typename !== 'GqlPoolGyro';

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
                pool: freshBeetsPool ?? pool, // necessary for now because we're dropping FTM from the FreshBeets pool
                poolService,
                bpt,
                allTokens,
                allTokenAddresses: allTokens.map((token) => token.address),
                requiresBatchRelayerOnJoin,
                requiresBatchRelayerOnExit,
                bptPrice,
                supportsZap,
                formattedTypeName: poolGetTypeName(pool),
                totalApr,
                isFbeetsPool: pool.id === networkConfig.fbeets.poolId,
                isStablePool,
                isComposablePool,
                canCustomInvest,
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
