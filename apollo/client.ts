import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { GetAppGlobalData } from '~/apollo/generated/operations';
import { concatPagination } from '@apollo/client/utilities';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<any>;

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({ uri: process.env.NEXT_PUBLIC_BACKEND_URL }),
        cache: new InMemoryCache({
            typePolicies: {
                GqlToken: {
                    keyFields: ['address'],
                },
                GqlTokenPrice: {
                    keyFields: ['address'],
                },
                Query: {
                    fields: {
                        poolGetJoinExits: concatPagination(),
                        poolGetSwaps: concatPagination(),
                        poolGetBatchSwaps: concatPagination(),
                    },
                },
            },
        }),
        queryDeduplication: true,
    });
}

export function initializeApolloClient(initialState: any = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data = merge(existingCache, initialState, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
            ],
        });

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export async function loadApolloState({
    client,
    props = {},
    pageSetup,
    revalidate = 1,
}: {
    client: ApolloClient<any>;
    props?: any;
    pageSetup?: () => Promise<void>;
    revalidate?: number;
}) {
    await client.query({ query: GetAppGlobalData });

    if (pageSetup) {
        await pageSetup();
    }

    return {
        props: {
            ...props,
            [APOLLO_STATE_PROP_NAME]: client.cache.extract(),
        },
        revalidate,
    };
}

export function useApollo(pageProps: any) {
    const state = pageProps[APOLLO_STATE_PROP_NAME];
    return useMemo(() => initializeApolloClient(state), [state]);
}
