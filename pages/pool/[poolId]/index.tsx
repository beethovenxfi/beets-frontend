import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import PoolDetail from '~/modules/pool/PoolDetail';

const Pool = () => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Rendering fallback...</div>;
    }

    const { poolId } = router.query;

    return <PoolDetail poolId={poolId as string} />;
};

export async function getStaticPaths() {
    return {
        paths: [
            {
                params: {
                    poolId: '0xdfc65c1f15ad3507754ef0fd4ba67060c108db7e000000000000000000000406',
                },
            },
        ],
        fallback: true,
    };
}

export async function getStaticProps({ params }: { params: { poolId: string } }) {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
        pageSetup: async () => {
            await client.query<GetPoolQuery, GetPoolQueryVariables>({
                query: GetPool,
                variables: { id: params.poolId },
            });
        },
    });
}

export default Pool;
