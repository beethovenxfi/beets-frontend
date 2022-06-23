import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GetPoolsQueryVariables,
    GqlPoolOrderBy,
    useGetPoolFiltersQuery,
    useGetPoolsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { useBoolean } from '@chakra-ui/hooks';
import { eq } from 'lodash';

interface PoolsQueryVariables extends GetPoolsQueryVariables {
    first: number;
    skip: number;
}

export const DEFAULT_POOL_LIST_QUERY_VARS: PoolsQueryVariables = {
    first: 20,
    skip: 0,
    orderBy: 'totalLiquidity',
    orderDirection: 'desc',
    where: {
        categoryIn: ['INCENTIVIZED'],
        poolTypeIn: ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
    },
    textSearch: null,
};

const poolListStateVar = makeVar<PoolsQueryVariables>(DEFAULT_POOL_LIST_QUERY_VARS);
const showMyInvestmentsVar = makeVar(false);
const showFiltersVar = makeVar(false);

export function usePoolList() {
    const state = useReactiveVar(poolListStateVar);
    const showMyInvestments = useReactiveVar(showMyInvestmentsVar);
    const [isSearching, isSearchingToggle] = useBoolean();
    const [isSorting, isSortingToggle] = useBoolean();

    const {
        data,
        loading,
        error,
        networkStatus,
        refetch: refetchPools,
    } = useGetPoolsQuery({
        notifyOnNetworkStatusChange: true,
        variables: state,
    });

    const { data: poolFilters } = useGetPoolFiltersQuery();

    async function refetch(newState: PoolsQueryVariables) {
        poolListStateVar(newState);

        return refetchPools(newState);
    }

    async function changeSort(orderBy: GqlPoolOrderBy) {
        const state = poolListStateVar();

        isSortingToggle.on();
        if (state.orderBy === orderBy) {
            await refetch({
                ...state,
                orderDirection:
                    state.orderDirection === 'asc' ? null : state.orderDirection === 'desc' ? 'asc' : 'desc',
            });
        } else {
            await refetch({
                ...state,
                orderBy: orderBy,
                orderDirection: 'desc',
            });
        }

        isSortingToggle.off();
    }

    async function setPageSize(pageSize: number) {
        await refetch({
            ...poolListStateVar(),
            first: pageSize,
            skip: 0,
        });
    }

    function setShowMyInvestments(show: boolean) {
        showMyInvestmentsVar(show);
    }

    function toggleFilterVisibility() {
        showFiltersVar(!showFiltersVar());
    }

    async function setPoolIds(poolIds: string[]) {
        const state = poolListStateVar();

        if (!eq(poolIds, state.where?.idIn)) {
            await refetch({
                ...state,
                where: {
                    ...state.where,
                    idIn: poolIds,
                },
            });
        }
    }

    async function clearPoolIds() {
        const state = poolListStateVar();

        await refetch({
            ...state,
            where: {
                ...state.where,
                idIn: undefined,
            },
        });
    }

    return {
        state,
        pools: data?.poolGetPools || [],
        count: data?.count,
        loading,
        error,
        networkStatus,
        refetch,
        changeSort,
        setPageSize,
        showMyInvestments,
        setShowMyInvestments,
        filters: poolFilters?.filters || [],
        toggleFilterVisibility,
        showFilters: useReactiveVar(showFiltersVar),
        setPoolIds,
        clearPoolIds,
    };
}
