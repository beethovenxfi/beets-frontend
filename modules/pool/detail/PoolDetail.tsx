import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolStats from '~/modules/pool/detail/components/PoolStats';
import PoolComposition from '~/modules/pool/detail/components/PoolComposition';
import Link from 'next/link';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBox } from '~/components/box/BeetsBox';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { PoolDetailMyBalance } from '~/modules/pool/detail/components/PoolDetailMyBalance';
import { PoolDetailActions } from '~/modules/pool/detail/components/PoolDetailActions';
import { PoolDetailMyRewards } from '~/modules/pool/detail/components/PoolDetailMyRewards';

function PoolDetail() {
    const { pool } = usePool();

    return (
        <Container maxW="full">
            <Flex mb={8}>
                <Box flex={1}>
                    <PoolHeader />
                </Box>
            </Flex>
            <Flex mb={12}>
                <Box flex={2}>
                    <PoolDetailChart mb={8} />
                    <PoolComposition pool={pool} />
                </Box>
                <Box flex={1} ml={8}>
                    <PoolDetailMyBalance mb={8} />
                    <PoolDetailActions mb={8} />
                    <PoolDetailMyRewards />
                </Box>
            </Flex>
        </Container>
    );
}

export default PoolDetail;
