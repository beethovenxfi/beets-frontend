import { Text } from '@chakra-ui/react';
import Head from 'next/head';
import { PoolCreate } from '~/modules/pool/create/PoolCreate';

const PoolCreatePage = () => {
    const TITLE = 'Beethoven X | Compose a Pool';
    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />
            </Head>
            <Text as="h1" textStyle="h1" mb="50px">
                Compose a pool
            </Text>
            <PoolCreate />
        </>
    );
};

export default PoolCreatePage;
