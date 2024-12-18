import PoolList from '../modules/pools/PoolList';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPools } from '~/apollo/generated/operations';
import { GetPoolsQuery, GetPoolsQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS, PoolListProvider } from '~/modules/pools/usePoolList';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';

function Pools() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beets | Investment pools';
    const DESCRIPTION =
        'Competitive yield with unmatched flexibility. Invest in a pool of your choice or create your own.';

    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />

                <meta name="description" content={DESCRIPTION} />
                <meta property="og:description" content={DESCRIPTION} />
                <meta property="twitter:description" content={DESCRIPTION} />
            </Head>
            <PoolListProvider>
                <UserTokenBalancesProvider>
                    <PageMasthead
                        title="Invest & Farm"
                        image={
                            <NextImage
                                src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                                width="208.62px"
                                height="68px"
                            />
                        }
                    />
                    <PoolList />
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

export default Pools;
