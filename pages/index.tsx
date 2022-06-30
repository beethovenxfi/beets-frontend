import { Home } from '~/modules/home/Home';
import Head from 'next/head';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetHomeData } from '~/apollo/generated/operations';

function HomePage() {
    return (
        <>
            <Head>
                <title>Beethoven X</title>
            </Head>
            <Home />
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
        pageSetup: async () => {
            await client.query({ query: GetHomeData });
        },
    });
}

export default HomePage;
