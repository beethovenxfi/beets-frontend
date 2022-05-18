import { useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Container, Heading } from '@chakra-ui/react';
import PoolHeader from '~/page-components/pool/PoolHeader';
import PoolStats from '~/page-components/pool/PoolStats';
import PoolComposition from '~/page-components/pool/PoolComposition';

interface Props {
    poolId: string;
}

function PoolDetail({ poolId }: Props) {
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
}

export default PoolDetail;
