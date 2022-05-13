import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GetPoolsQueryVariables,
    GqlPoolOrderBy,
    GqlPoolOrderDirection,
    useGetPoolsQuery,
} from '~/apollo/generated/graphql-codegen-generated';

export const DEFAULT_POOL_LIST_QUERY_VARS: GetPoolsQueryVariables = {
    first: 10,
    skip: 0,
    orderBy: 'totalLiquidity',
    orderDirection: 'asc',
    where: {
        categoryIn: ['INCENTIVIZED'],
        poolTypeIn: ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
    },
    textSearch: null,
};

const poolListStateVar = makeVar<GetPoolsQueryVariables>(DEFAULT_POOL_LIST_QUERY_VARS);

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

    async function changeSort(orderBy: GqlPoolOrderBy) {
        if (state.orderBy === orderBy) {
            switch (state.orderDirection) {
                case 'asc':
                    state.orderDirection = null;
                    break;
                case 'desc':
                    state.orderDirection = 'asc';
                    break;
                default:
                    state.orderDirection = 'desc';
            }
        } else {
            state.orderBy = orderBy;
            state.orderDirection = 'desc';
        }

        await refetch();
    }

    async function submitSearch() {
        await refetch();
    }

    return {
        state,
        pools: data?.poolGetPools,
        loading,
        error,
        fetchMore,
        networkStatus,
        refetch,
        changeSort,
    };
}
