import PoolList from '../modules/pools/PoolList';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPoolFilters, GetPools } from '~/apollo/generated/operations';
import { GetPoolsQuery, GetPoolsQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS } from '~/modules/pools/usePoolList';
import { Box } from '@chakra-ui/layout';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';

function Pools() {
    return (
        <>
            <Head>
                <title>Beethoven X | Investment pools</title>
            </Head>
            <PageMasthead
                title="Invest & Farm"
                image={<NextImage src={InvestMastheadImage} width="316px" height="103px" />}
            />
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

            await client.query({ query: GetPoolFilters });
        },
    });
}

export default Pools;
