import { Home } from '~/modules/home/Home';
import Head from 'next/head';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetHomeData } from '~/apollo/generated/operations';

function HomePage() {
    return (
        <>
            <Head>
                <meta name="title" content="Beethoven X" />
                <meta
                    name="description"
                    content="The future of DeFi re-imagineered. Your next generation Decentralised Exchange."
                />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${process.env.VERCEL_URL}`} />
                <meta property="og:title" content="Beethoven X" />
                <meta
                    property="og:description"
                    content="The future of DeFi re-imagineered. Your next generation Decentralised Exchange."
                />
                <meta
                    property="og:image"
                    content="https://beethoven-assets.s3.eu-central-1.amazonaws.com/social-image.png"
                />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`${process.env.VERCEL_URL}`} />
                <meta property="twitter:title" content="Beethoven X" />
                <meta
                    property="twitter:description"
                    content="The future of DeFi re-imagineered. Your next generation Decentralised Exchange."
                />
                <meta
                    property="twitter:image"
                    content="https://beethoven-assets.s3.eu-central-1.amazonaws.com/social-image.png"
                />
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
