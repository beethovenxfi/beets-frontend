import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { TradeContainer } from '~/modules/trade/TradeContainer';

function Trade() {
    return (
        <>
            <Head>
                <title>Beethoven X | Swap</title>
            </Head>
            <TradeContainer />
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({ client });
}

export default Trade;
