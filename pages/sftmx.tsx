import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import SftmxLanding from '~/modules/sftmx/SftmxLanding';
import { VStack, Heading } from '@chakra-ui/react';

function Stake() {
    const { chainId, sftmxEnabled } = useNetworkConfig();

    const TITLE = 'Beethoven X | Stake FTM';
    const DESCRIPTION = 'Text';

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
                title="sFTMX"
                image={
                    <NextImage
                        src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                        width="208.62px"
                        height="68px"
                    />
                }
            />
            {sftmxEnabled ? (
                <UserTokenBalancesProvider>
                    <SftmxLanding />
                </UserTokenBalancesProvider>
            ) : (
                <VStack minH="300px" justifyContent="center">
                    <Heading>sFTMX is not supported on this chain.</Heading>
                </VStack>
            )}
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

export default Stake;
