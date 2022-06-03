import { GqlPoolUnion, useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { TokenBase } from '~/lib/services/token/token-types';
import { uniqBy } from 'lodash';
import { useContext, useEffect } from 'react';
import { PoolContext } from '~/modules/pool/components/PoolProvider';
import { poolGetServiceForPool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { networkConfig } from '~/lib/config/network-config';

export function usePool() {
    //we force cast here because the pool will never be null
    const poolFromContext = useContext(PoolContext) as GqlPoolUnion;
    const { data, networkStatus, startPolling } = useGetPoolQuery({
        variables: { id: poolFromContext.id },
        notifyOnNetworkStatusChange: true,
    });
    const pool = data?.pool || poolFromContext;
    const poolService = poolGetServiceForPool(pool);

    //TODO: not sure why poll interval doesn't seem to be triggering
    useEffectOnce(() => {
        startPolling(30000);
    });

    useEffect(() => {
        poolService.updatePool(pool);
    }, [networkStatus]);

    const bpt: TokenBase = {
        address: pool.address,
        symbol: pool.symbol,
        name: pool.name,
        decimals: pool.decimals,
    };

    const allTokensWithDuplicates = [
        ...pool.allTokens,
        bpt,
        ...pool.investConfig.options.flatMap((option) => option.tokenOptions),
        ...pool.withdrawConfig.options.flatMap((option) => option.tokenOptions),
    ];
    const allTokens = uniqBy(allTokensWithDuplicates, (token) => token.address);

    return {
        pool,
        poolService,
        allTokens,
        allTokenAddresses: allTokens.map((token) => token.address),
        bpt,
        poolTokensWithoutPhantomBpt: poolGetTokensWithoutPhantomBpt(pool),
        totalApr: parseFloat(pool.dynamicData.apr.total),
    };
}
