import { Box, Container, Flex, HStack, VStack } from '@chakra-ui/react';
import PoolHeader from '~/modules/pool/detail/components/PoolHeader';
import PoolComposition from '~/modules/pool/detail/components/composition/PoolComposition';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolDetailChart from '~/modules/pool/detail/components/PoolDetailChart';
import { useGetTokens } from '~/lib/global/useToken';
import { useProvider } from 'wagmi';
import PoolStats from './components/stats/PoolStats';
import { PoolTransactions } from './components/transactions/PoolTransactions';
import PoolActionRow from './PoolActionRow';

function Pool() {
    const { pool } = usePool();
    const { tokens } = useGetTokens();
    const provider = useProvider();

    return (
        <Box marginBottom="8">
            <PoolHeader />
            <VStack width="full">
                <Flex width="full" justifyContent="flex-end">
                    <PoolActionRow />
                </Flex>
                <HStack width="full" spacing="3" height="md">
                    <PoolStats />
                    <PoolDetailChart />
                </HStack>
            </VStack>
            <VStack spacing="8" width="full">
                <PoolComposition pool={pool} />
                <PoolTransactions />
            </VStack>
        </Box>
    );
}

export default Pool;
