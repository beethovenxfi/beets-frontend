import { Box, Button, Container, Flex } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolStats from '~/modules/pool/detail/components/PoolStats';
import PoolComposition from '~/modules/pool/detail/components/PoolComposition';
import Link from 'next/link';
import { usePool } from '~/modules/pool/lib/usePool';

function PoolDetail() {
    const { pool } = usePool();

    return (
        <Container maxW="full">
            <Flex>
                <Box flex={1}>
                    <PoolHeader />
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
                <PoolComposition pool={pool} />
            </Box>
        </Container>
    );
}

export default PoolDetail;
