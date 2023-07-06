import { Box, Flex } from '@chakra-ui/react';
import { LgeListTabs } from './LgeListTabs';

export function LgeListTop() {
    return (
        <Box display={{ base: 'none', lg: 'block' }}>
            <Flex pb={4}>
                <Flex flex={1}>
                    <LgeListTabs />
                </Flex>
            </Flex>
        </Box>
    );
}
