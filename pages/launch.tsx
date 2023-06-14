import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetLges } from '~/apollo/generated/operations';
import { GetLgesQuery, GetLgesQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import LgeList from '~/modules/lges/LgeList';
import { LgeListProvider } from '~/modules/lges/useLgeList';

function Launch() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beethoven X | Liquidity Bootstrapping Pools';
    const DESCRIPTION = 'XXX Needs content XXX';

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
            <LgeListProvider>
                <PageMasthead
                    title="Liquidity BootStrapping Pools"
                    image={
                        <NextImage
                            src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                            width="208.62px"
                            height="68px"
                        />
                    }
                />
                <LgeList />
            </LgeListProvider>
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
        pageSetup: async () => {
            await client.query<GetLgesQuery, GetLgesQueryVariables>({
                query: GetLges,
            });
        },
    });
}

export default Launch;
