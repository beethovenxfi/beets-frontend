import { useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { TokenBase } from '~/lib/services/token/token-types';
import { uniqBy } from 'lodash';

export function usePool(poolId: string) {
    const { data, loading, error } = useGetPoolQuery({ pollInterval: 30000, variables: { id: poolId } });
    const pool = data?.pool;
    const bpt: TokenBase = {
        address: pool?.address || '',
        symbol: pool?.symbol || '',
        name: pool?.name || '',
        decimals: pool?.decimals || 18,
    };
    const allTokens = pool
        ? [
              ...pool.allTokens,
              bpt,
              ...pool.investConfig.options.flatMap((option) => option.tokenOptions),
              ...pool.withdrawConfig.options.flatMap((option) => option.tokenOptions),
          ]
        : [];

    return {
        pool,
        allTokens: uniqBy(allTokens, (token) => token.address),
        loading,
        error,
        bpt,
    };
}
