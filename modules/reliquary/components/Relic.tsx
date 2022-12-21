import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import { RelicNFT } from '~/modules/reliquary/components/RelicNFT';
import { RelicStats } from '~/modules/reliquary/components/RelicStats';
import { RelicHeader } from '~/modules/reliquary/components/RelicHeader';

export function Relic() {
    return (
        <Box width="full" mt="4" position="relative">
            <RelicHeader />
            <HStack position="relative" width="full" alignItems="flex-start" spacing="0" height="full">
                <Box width="50%" mt="8">
                    <RelicStats />
                </Box>
                <HStack position="sticky" top='50px' flex={1} alignItems="center" justifyContent="center">
                    <Box position="relative" mt="12">
                        <RelicNFT />
                    </Box>
                </HStack>
            </HStack>
        </Box>
    );
}
