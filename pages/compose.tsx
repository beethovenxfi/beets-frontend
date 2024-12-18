import { initializeApolloClient, loadApolloState } from '~/apollo/client';
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

    const TITLE = 'Beets | Create a pool';
    const DESCRIPTION = 'Unbound composability made simple. Build your own weighted pools with up to 8 tokens.';

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
            <PageMasthead
                title="Weighted pool creation"
                image={
                    <NextImage
                        src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                        width="208.62px"
                        height="68px"
                    />
                }
            />
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
        pageSetup: async () => {},
    });
}

export default Compose;
