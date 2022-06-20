import { Box, Flex } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';

export function HomeFeaturedPools() {
    return (
        <Box py="12">
            <Box mb="2" fontSize="2xl" fontWeight="bold">
                Featured pools
            </Box>
            <Flex>
                <Box flex="1" mr="4">
                    <PoolCard />
                </Box>
                <Box flex="1" mr="4">
                    <PoolCard />
                </Box>
                <Box flex="1" mr="4">
                    <PoolCard />
                </Box>
                <Box flex="1">
                    <PoolCard />
                </Box>
            </Flex>
        </Box>
    );
}
