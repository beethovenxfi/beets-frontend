import { makeVar, useReactiveVar } from '@apollo/client';
import { GetPoolsQueryVariables, useGetPoolsQuery } from '~/apollo/generated/graphql-codegen-generated';

const poolListStateVar = makeVar<GetPoolsQueryVariables>({
    first: 10,
    skip: 0,
    orderBy: 'totalLiquidity',
    orderDirection: 'desc',
    where: {
        categoryIn: ['INCENTIVIZED'],
        poolTypeNotIn: ['UNKNOWN', 'LIQUIDITY_BOOTSTRAPPING'],
        poolTypeIn: ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
    },
});

export function usePoolList() {
    const state = useReactiveVar(poolListStateVar);
    const {
        data,
        loading,
        error,
        fetchMore,
        networkStatus,
        refetch: refetchPools,
    } = useGetPoolsQuery({
        notifyOnNetworkStatusChange: true,
        variables: state,
    });

    async function refetch() {
        return refetchPools(state);
    }

    return {
        state,
        pools: data?.poolGetPools,
        loading,
        error,
        fetchMore,
        networkStatus,
        refetch,
    };
}
