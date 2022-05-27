import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetFbeetsRatio, GetPool } from '~/apollo/generated/operations';
import PoolDetail from '~/modules/pool/detail/PoolDetail';
import { PoolProvider } from '~/modules/pool/components/PoolProvider';
import { networkConfig } from '~/lib/config/network-config';

interface Props {
    pool: GqlPoolUnion;
}

const Pool = ({ pool }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Rendering fallback...</div>;
    }

    return (
        <PoolProvider pool={pool}>
            <PoolDetail />
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

export default Pool;
