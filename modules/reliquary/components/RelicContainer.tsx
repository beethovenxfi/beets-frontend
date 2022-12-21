import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import useReliquary from '../hooks/useReliquary';
import { RelicNFT } from '~/modules/reliquary/components/RelicNFT';
import { RelicStats } from '~/modules/reliquary/components/RelicStats';
import { RelicHeader } from '~/modules/reliquary/components/RelicHeader';

export function RelicContainer() {
    return (
        <Box width="full">
            <RelicHeader />
            <HStack position='relative' width="full" alignItems="flex-start" spacing="0" height="full">
                <VStack alignItems="flex-start" mt="8" spacing="4" width="40%">
                    <RelicStats />
                </VStack>
                <HStack position='sticky' top='100px' flex={1} mt="4" alignItems="center" justifyContent="center">
                    <RelicNFT />
                </HStack>
            </HStack>
        </Box>
    );
}
