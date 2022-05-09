import { useRouter } from 'next/router';
import Navbar from '../../components/nav/Navbar';
import { Container, VStack } from '@chakra-ui/react';
import { useGetPoolQuery } from '../../apollo/generated/graphql-codegen-generated';

const PoolId = () => {
    const router = useRouter();
    const { poolId } = router.query;
    const { data, loading, error } = useGetPoolQuery({ variables: { id: poolId as string } });
    const pool = data?.pool;

    return (
        <VStack spacing="16" marginX="32">
            <Navbar />

            <Container bg="gray.900" color={'white'} width="full" shadow="lg" rounded="lg" padding="4" mb={12}>
                {pool?.name}
                <br />
                {pool?.symbol}
                <br />
            </Container>
        </VStack>
    );
};

export default PoolId;
