import { useGetPoolQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Container, Flex, Heading, Button } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/PoolHeader';
import PoolStats from '~/modules/pool/PoolStats';
import PoolComposition from '~/modules/pool/PoolComposition';
import Link from 'next/link';

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
            <Flex>
                <Box flex={1}>
                    <PoolHeader pool={pool} />
                </Box>
                <Box>
                    <Link href={`/pool/${pool.id}/invest`}>
                        <Button bgColor="green.500" mr={4}>
                            Invest
                        </Button>
                    </Link>
                    <Link href={`/pool/${pool.id}/withdraw`}>
                        <Button bgColor="blue.500">Withdraw</Button>
                    </Link>
                </Box>
            </Flex>
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
