import { useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { TokenBase } from '~/lib/services/token/token-types';

export function usePool(poolId: string) {
    const { data, loading, error } = useGetPoolQuery({ pollInterval: 30000, variables: { id: poolId } });
    const pool = data?.pool;
    const bpt: TokenBase = {
        address: pool?.address || '',
        symbol: pool?.symbol || '',
        name: pool?.name || '',
        decimals: pool?.decimals || 18,
    };
    const allTokens = pool ? [...pool.allTokens, bpt] : [];

    return {
        pool,
        allTokens,
        loading,
        error,
        bpt,
    };
}
