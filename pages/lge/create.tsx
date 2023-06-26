import Head from 'next/head';
import { LgeCreate } from '~/modules/lge/create/LgeCreate';

function LgeCreatePage() {
    const TITLE = 'Beethoven X | Liquidity Bootstrapping Pools';
    // TODO update description
    const DESCRIPTION = 'XXX Needs content XXX';

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
            <LgeCreate />
        </>
    );
}

export default LgeCreatePage;
