import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { TradeContainer } from '~/modules/trade/TradeContainer';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import SwapMastheadImage from '~/assets/images/swap-masthead-image.png';
import SwapMastheadOpImage from '~/assets/images/swap-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

function Swap() {
    const { chainId } = useNetworkConfig();
    return (
        <>
            <Head>
                <title>Beethoven X | Swap</title>
            </Head>
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
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Swap;
