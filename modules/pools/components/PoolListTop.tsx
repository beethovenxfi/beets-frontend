import { Box, HStack } from '@chakra-ui/react';
import { PoolListTabs } from '~/modules/pools/components/PoolListTabs';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';

export function PoolListTop() {
    return (
        <Box display={{ base: 'none', lg: 'block' }}>
            <HStack pb="4" justifyContent="space-between">
                <HStack>
                    <PoolListTabs />
                    <PoolListSearch />
                </HStack>
            </HStack>
        </Box>
    );
}
