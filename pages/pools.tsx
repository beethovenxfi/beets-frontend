import PoolList from '../modules/pools/components/PoolList';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPools } from '~/apollo/generated/operations';
import {
    GetPoolsQuery,
    GetPoolsQueryVariables,
    useGetTokenNamesQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS } from '~/modules/pools/usePoolList';

function Pools() {
    const { data } = useGetTokenNamesQuery({ pollInterval: 15 });

    return (
        <>
            <PoolList />
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
        pageSetup: async () => {
            await client.query<GetPoolsQuery, GetPoolsQueryVariables>({
                query: GetPools,
                variables: DEFAULT_POOL_LIST_QUERY_VARS,
            });
        },
    });
}

export default Pools;
