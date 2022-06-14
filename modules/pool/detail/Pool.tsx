import { Box, Container, Flex, VStack, HStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolComposition from '~/modules/pool/detail/components/composition/PoolComposition';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useGetTokens } from '~/lib/global/useToken';
import { useProvider } from 'wagmi';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import PoolActionRow from './PoolActionRow';

function Pool() {
    const { pool } = usePool();
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
        <Container maxW="full" marginBottom="8">
            <PoolHeader />
            <VStack width='full'>
                <Flex width="full" justifyContent="flex-end">
                    <PoolActionRow />
                </Flex>
                <HStack width='full' spacing="3" height="md">
                    <PoolStats />
                    <PoolDetailChart />
                </HStack>
            </VStack>
            <VStack spacing="8" width="full">
                <PoolComposition pool={pool} />
                <PoolTransactions />
            </VStack>
        </Container>
    );
}

export default Pool;
