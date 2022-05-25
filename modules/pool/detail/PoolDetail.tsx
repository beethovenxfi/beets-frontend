import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolStats from '~/modules/pool/detail/components/PoolStats';
import PoolComposition from '~/modules/pool/detail/components/PoolComposition';
import Link from 'next/link';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBox } from '~/components/box/BeetsBox';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { PoolDetailMyBalance } from '~/modules/pool/detail/components/PoolDetailMyBalance';

function PoolDetail() {
    const { pool } = usePool();

    return (
        <Container maxW="full">
            <Flex mb={8}>
                <Box flex={1}>
                    <PoolHeader />
                </Box>
                {/*<Box>
                    <Link href={`/pool/${pool.id}/invest`}>
                        <Button bgColor="green.500" mr={4}>
                            Invest
                        </Button>
                    </Link>
                    <Link href={`/pool/${pool.id}/withdraw`}>
                        <Button bgColor="blue.500">Withdraw</Button>
                    </Link>
                </Box>*/}
            </Flex>
            <Flex>
                <Box flex={2}>
                    <PoolDetailChart mb={8} />
                    <PoolComposition pool={pool} />
                </Box>
                <Box flex={1} ml={8}>
                    <PoolDetailMyBalance />
                    <BeetsBox h="2xs" display="flex" justifyContent="center" alignItems="center" mt={8}>
                        <Text textStyle="h3" fontWeight="bold">
                            INVEST / WITHDRAW
                        </Text>
                    </BeetsBox>
                    <BeetsBox h="3xs" display="flex" justifyContent="center" alignItems="center" mt={8}>
                        <Text textStyle="h3" fontWeight="bold">
                            REWARDS
                        </Text>
                    </BeetsBox>
                </Box>
            </Flex>
        </Container>
    );
}

export default PoolDetail;
