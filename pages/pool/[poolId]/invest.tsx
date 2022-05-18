import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import PoolInvest from '~/modules/pool-invest/PoolInvest';

const Invest = () => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Rendering fallback...</div>;
    }

    const { poolId } = router.query;

    return <PoolInvest poolId={poolId as string} />;
};

export async function getStaticPaths() {
    return {
        paths: [],
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

export default Invest;
