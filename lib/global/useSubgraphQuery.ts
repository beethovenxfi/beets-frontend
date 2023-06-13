import { DocumentNode } from 'graphql';
import { QueryKey, QueryOptions, UseQueryOptions, useQuery } from 'react-query';
import axios from 'axios';

import constants from '~/lib/global/constants';

export type SupportedSubgraphs = 'mainnet-gauge' | 'optimism-gauge';
export type SubgraphResponse<T> = {
    data: T;
};

export default function useSubgraphQuery<
    T,
    TQueryFnData = T,
    TError = unknown,
    TData = T,
    TQueryKey extends QueryKey = QueryKey,
>(
    subgraph: SupportedSubgraphs,
    query: DocumentNode,
    variables: any,
    options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'> = {},
) {
    const queryString = query.loc?.source.body;
    const url = constants.subgraphs[subgraph];
    const queryInstance = useQuery(
        ['subgraph-query', { subgraph, query: queryString, variables }] as any,
        async () => {
            const response = await axios.post<SubgraphResponse<T>>(url, {
                query: queryString,
                variables,
            });

            return response.data.data;
        },
        options as any,
    );

    return queryInstance;
}
