import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import { RelicNFT } from '~/modules/reliquary/components/RelicNFT';
import { RelicStats } from '~/modules/reliquary/components/RelicStats';
import { RelicHeader } from '~/modules/reliquary/components/RelicHeader';
import { motion } from 'framer-motion';

export function Relic() {
    return (
        <Box as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} width="full" mt="4" position="relative">
            <RelicHeader />
            <HStack
                flexDirection={{ base: 'column-reverse', md: 'row' }}
                position="relative"
                width="full"
                alignItems="flex-start"
                spacing="0"
                height="full"
            >
                <Box width={{ base: 'full', md: '50%' }} mt={{ base: '0', md: '8' }}>
                    <RelicStats />
                </Box>
                <HStack
                    position={{ base: 'relative', md: 'sticky' }}
                    top={{ base: '0px', md: '50px' }}
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box position="relative" mt={{ base: '0', md: '12' }}>
                        <RelicNFT />
                    </Box>
                </HStack>
            </HStack>
        </Box>
    );
}
