import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPools } from '~/apollo/generated/operations';
import { GetPoolsQuery, GetPoolsQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS, PoolListProvider } from '~/modules/pools/usePoolList';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import { RecoveryExitContent } from '~/modules/recovery-exit/RecoveryExitContent';

function LinearPools() {
    const TITLE = 'Beets | Recovery exit';

    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />
            </Head>
            <PoolListProvider>
                <UserTokenBalancesProvider>
                    <PageMasthead title="Recovery exit" image={null} />
                    <RecoveryExitContent />
                </UserTokenBalancesProvider>
            </PoolListProvider>
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

export default LinearPools;
