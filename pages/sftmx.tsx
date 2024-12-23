import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import SFTMxMastheadImage from '~/assets/images/sFTMx-header.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import SftmxLanding from '~/modules/sftmx/SftmxLanding';
import { VStack, Heading } from '@chakra-ui/react';

function Stake() {
    const { chainId, sftmxEnabled } = useNetworkConfig();

    const TITLE = 'Beets | Stake FTM';
    const DESCRIPTION = 'Flexible. Secure. Aligned. Earn native rewards with liquid staking on Fantom.';

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
            <PageMasthead title="sFTMx" image={<NextImage src={SFTMxMastheadImage} width="208.62px" height="68px" />} />
            {sftmxEnabled ? (
                <UserTokenBalancesProvider>
                    <SftmxLanding />
                </UserTokenBalancesProvider>
            ) : (
                <VStack minH="300px" justifyContent="center">
                    <Heading>sFTMx is not supported on this chain.</Heading>
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
