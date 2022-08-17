import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import { PoolOpenGraph } from '~/modules/pool/og/PoolOpenGraph';
import { PoolProvider } from '~/modules/pool/lib/usePool';
import Head from 'next/head';
import { FallbackPlaceholder } from '~/components/fallback/FallbackPlaceholder';

interface Props {
    pool: GqlPoolUnion;
}

const PoolPageOpenGraph = ({ pool }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPlaceholder />;
    }

    return (
        <PoolProvider pool={pool}>
            <PoolOpenGraph />
        </PoolProvider>
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

export default PoolPageOpenGraph;
