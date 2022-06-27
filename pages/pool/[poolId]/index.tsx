import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import { Pool } from '~/modules/pool/detail/Pool';
import { PoolProvider } from '~/modules/pool/components/PoolProvider';
import Head from 'next/head';

interface Props {
    pool: GqlPoolUnion;
}

const PoolPage = ({ pool }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Rendering fallback...</div>;
    }

    return (
        <>
            <Head>
                <title>Beethoven X | {pool.name}</title>
            </Head>
            <PoolProvider pool={pool}>
                <Pool />
            </PoolProvider>
        </>
    );
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }: { params: { poolId: string } }) {
    const client = initializeApolloClient();
    const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: params.poolId },
    });

    //pre-load the fbeets ratio for fidelio duetto
    /*if (params.poolId === networkConfig.fbeets.poolId) {
        await client.query({ query: GetFbeetsRatio });
    }*/

    return loadApolloState({
        client,
        props: { pool: data.pool },
    });
}

export default PoolPage;
