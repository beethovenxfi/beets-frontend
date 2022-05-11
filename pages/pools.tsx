import PoolList from '../page-components/pools/PoolList';
import { addApolloState, initializeApollo } from '~/apollo/client';
import { GetPools, GetTokenPrices, GetTokens } from '~/apollo/generated/operations';
import { GetPoolsQuery, GetPoolsQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS } from '~/page-components/pools/usePoolList';

function Pools() {
    return (
        <>
            <PoolList />
        </>
    );
}

export async function getStaticProps() {
    const apolloClient = initializeApollo();

    await apolloClient.query({ query: GetTokens });
    await apolloClient.query({ query: GetTokenPrices });
    await apolloClient.query<GetPoolsQuery, GetPoolsQueryVariables>({
        query: GetPools,
        variables: DEFAULT_POOL_LIST_QUERY_VARS,
    });

    return addApolloState(apolloClient, { props: {}, revalidate: 1 });
}

export default Pools;
