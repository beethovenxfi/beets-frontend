import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { TradeContainer } from '~/modules/trade/TradeContainer';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import SwapMastheadImage from '~/assets/images/swap-masthead-image.png';
import SwapMastheadOpImage from '~/assets/images/swap-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';

function Swap() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beethoven X | Swap';
    const DESCRIPTION = 'Intelligent trades at optimal prices. Swap your tokens with the Smart Order Router.';

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
            <UserTokenBalancesProvider>
                <PageMasthead
                    title="Swap"
                    image={
                        <NextImage
                            src={chainId === '10' ? SwapMastheadOpImage : SwapMastheadImage}
                            width="213.71px"
                            height="68px"
                        />
                    }
                />
                <TradeContainer />
            </UserTokenBalancesProvider>
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Swap;
