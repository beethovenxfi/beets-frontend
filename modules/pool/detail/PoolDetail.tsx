import { Box, Container, Flex, VStack, HStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolComposition from '~/modules/pool/detail/components/PoolComposition';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { PoolDetailMyBalance } from '~/modules/pool/detail/components/PoolDetailMyBalance';
import { PoolDetailActions } from '~/modules/pool/detail/components/PoolDetailActions';
import { PoolDetailMyRewards } from '~/modules/pool/detail/components/PoolDetailMyRewards';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useGetTokens } from '~/lib/global/useToken';
import { useProvider } from 'wagmi';
import { PoolDetailTransactions } from '~/modules/pool/detail/components/PoolDetailTransactions';
import PoolMetrics from './components/PoolMetrics';

function PoolDetail() {
    const { pool } = usePool();
    const { isLoading, hasBpt } = usePoolUserPoolTokenBalances();

    const { tokens } = useGetTokens();
    const provider = useProvider();

    useAsyncEffect(async () => {
        await masterChefService.getPendingRewards({
            userAddress: '0x4fbe899d37fb7514adf2f41B0630E018Ec275a0C',
            farms: pool.staking?.farm ? [pool.staking.farm] : [],
            tokens,
            provider,
        });
    }, []);

    return (
        <Container maxW="full">
            <PoolHeader />
            <HStack spacing='3' height="md">
                <PoolMetrics />
                <PoolDetailChart />
            </HStack>
            <PoolComposition pool={pool} />
            <PoolDetailTransactions mt={8} />
        </Container>
    );
}

// <Flex mb={12}>
// <Box flex={2}>

//     {/* <PoolDetailChart mb={8} /> */}
//     <PoolComposition pool={pool} />
//     <PoolDetailTransactions mt={8} />
// </Box>
// <Box flex={1} ml={8}>
//     {hasBpt || isLoading ? <PoolDetailMyBalance mb={8} /> : null}
//     {(hasBpt && pool.staking) || isLoading ? <PoolDetailMyRewards mb={8} /> : null}
//     <PoolDetailActions />
// </Box>
// </Flex>
export default PoolDetail;
