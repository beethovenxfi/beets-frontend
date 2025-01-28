import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { TradeContainer } from '~/modules/trade/TradeContainer';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import SwapMastheadImage from '~/assets/images/swap-masthead-image.png';
import SwapMastheadOpImage from '~/assets/images/swap-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import { Center, Link, List, ListItem, Text } from '@chakra-ui/react';

function Swap() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beets | Swap';
    const DESCRIPTION = 'Please swap your tokens using one of the available aggregators.';

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
                    title="Swap Has Moved!"
                    image={
                        <NextImage
                            src={chainId === '10' ? SwapMastheadOpImage : SwapMastheadImage}
                            width="213.71px"
                            height="68px"
                        />
                    }
                />
                <Text>Swap functionality has found a new home on Sonic.</Text>
                <Text mb="4">
                    If you need to swap tokens on the Fantom network, we recommend using one of the aggregators listed
                    below.
                </Text>
                <List mb="16">
                    <ListItem>
                        <Link href="https://app.odos.xyz/" target="_blank">
                            Odos
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href="https://app.paraswap.xyz/#/swap/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE/0/SELL?network=fantom&version=6.2"
                            target="_blank"
                        >
                            Paraswap
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://app.1inch.io/#/250/simple/swap/250:FTM" target="_blank">
                            1inch
                        </Link>
                    </ListItem>
                </List>
            </UserTokenBalancesProvider>
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Swap;
