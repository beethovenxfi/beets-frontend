import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetLges } from '~/apollo/generated/operations';
import { GetLgesQuery, GetLgesQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import ComposeProvider from '~/modules/compose/ComposeProvider';
import ComposeFlow from '~/modules/compose/ComposeFlow';
import { Box } from '@chakra-ui/react';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';

function Compose() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beethoven X | Create a pool';
    // TODO update description
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
            {/* <PageMasthead
                title="Create a pool"
                image={
                    <NextImage
                        src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                        width="208.62px"
                        height="68px"
                    />
                }
            /> */}
            <UserTokenBalancesProvider>
                <ComposeProvider>
                    <Box mt="8">
                        <ComposeFlow />
                    </Box>
                </ComposeProvider>
            </UserTokenBalancesProvider>
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

export default Compose;
