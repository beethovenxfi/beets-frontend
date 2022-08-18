import { Home } from '~/modules/home/Home';
import Head from 'next/head';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetHomeData } from '~/apollo/generated/operations';

function HomePage() {
    const TITLE = 'Beethoven X';
    const DESCRIPTION = 'The future of DeFi re-imagineered. Your next generation Decentralised Exchange.';
    const URL = `${process.env.VERCEL_URL}`;
    const IMG_URL = 'https://beethoven-assets.s3.eu-central-1.amazonaws.com/social-image.png';

    return (
        <>
            <Head>
                <meta name="title" content={TITLE} />
                <meta name="description" content={DESCRIPTION} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={URL} />
                <meta property="og:title" content={TITLE} />
                <meta property="og:description" content={DESCRIPTION} />
                <meta property="og:image" content={IMG_URL} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={URL} />
                <meta property="twitter:title" content={TITLE} />
                <meta property="twitter:description" content={DESCRIPTION} />
                <meta property="twitter:image" content={IMG_URL} />
                <title>{TITLE}</title>
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
