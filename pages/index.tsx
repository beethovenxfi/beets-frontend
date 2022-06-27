import { Home } from '~/modules/home/Home';
import Head from 'next/head';

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

export default HomePage;
