import { useRouter } from 'next/router';
import { Box, Container, Heading } from '@chakra-ui/react';
import { GetPoolQuery, GetPoolQueryVariables, useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import PoolHeader from '~/page-components/pool/PoolHeader';
import PoolStats from '~/page-components/pool/PoolStats';
import PoolComposition from '~/page-components/pool/PoolComposition';

const PoolId = () => {
    const router = useRouter();
    const { poolId } = router.query;
    console.log('render', poolId);
    const { data, loading, error } = useGetPoolQuery({ pollInterval: 30000, variables: { id: poolId as string } });
    const pool = data?.pool;

    if (!pool) {
        return (
            <Container maxW="full">
                <Heading>Loading...</Heading>
            </Container>
        );
    }

    return (
        <Container maxW="full">
            <PoolHeader pool={pool} />
            <Box mt={8}>
                <PoolStats pool={pool} />
            </Box>
            <Box mt={8}>
                <PoolComposition pool={pool} />
            </Box>
        </Container>
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

export default PoolId;
