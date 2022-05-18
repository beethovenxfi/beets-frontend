import { useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';

export function usePool(poolId: string) {
    const { data, loading, error } = useGetPoolQuery({ pollInterval: 30000, variables: { id: poolId } });
    const pool = data?.pool;
    const allTokens = pool?.allTokens || [];

    return {
        pool,
        allTokens,
        loading,
        error,
    };
}
