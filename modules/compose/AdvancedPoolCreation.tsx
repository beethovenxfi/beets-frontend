import { Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Card from '~/components/card/Card';
import { useCompose } from './ComposeProvider';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import AdvancedPoolComposeTokens from './AdvancedPoolComposeTokens';
import { AdvancedPoolComposeFees } from './AdvancedPoolComposeFees';
import { AdvancedPoolComposeFeeManager } from './AdvancedPoolComposeFeeManager';
import { AdvancedPoolComposeSubmit } from './AdvancedPoolComposeSubmit';

interface Props {}

export default function AdvancedPoolCreation(props: Props) {
    return (
        <VStack spacing="4" width="full" mb="10">
            <VStack width="75%" alignItems="flex-start">
                <AdvancedPoolComposeTokens />
                <Box width="full">
                    <HStack>
                        <VStack width="full">
                            <AdvancedPoolComposeFees />
                            <AdvancedPoolComposeFeeManager />
                            {/* TODO IMPLEMENT SUBMISSION PREREQUISITES AND VALIDATION */}
                            <AdvancedPoolComposeSubmit />
                        </VStack>
                    </HStack>
                </Box>
            </VStack>
        </VStack>
    );
}
