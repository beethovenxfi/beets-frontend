import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://backend.beets-ftm-node.com/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});
