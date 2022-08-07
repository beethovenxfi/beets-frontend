import { createContext, useEffect, useMemo } from 'react';
import { GqlPoolUnion, useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { poolGetServiceForPool, poolGetTypeName, poolRequiresBatchRelayerOnJoin } from '~/lib/services/pool/pool-util';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { PoolService } from '~/lib/services/pool/pool-types';
import { TokenBase } from '~/lib/services/token/token-types';
import { uniqBy } from 'lodash';

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
}

export const PoolContext = createContext<PoolContextType | null>(null);

interface Props {
    pool: GqlPoolUnion;
    children: any;
}

export function PoolProvider({ pool: poolFromProps, children }: Props) {
    const { data, networkStatus, startPolling } = useGetPoolQuery({
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

    useEffectOnce(() => {
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
            }}
        >
            {children}
        </PoolContext.Provider>
    );
}
