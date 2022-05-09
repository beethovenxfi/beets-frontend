import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    poolGetPools: {
                        // Don't cache separate results based on
                        // any of this field's arguments.
                        keyArgs: false,

                        // Concatenate the incoming list items with
                        // the existing list items.
                        merge(existing = [], incoming) {
                            return [...existing, ...incoming];
                        },
                    },
                },
            },
            /*Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },*/
        },
    }),
    queryDeduplication: true,
});
