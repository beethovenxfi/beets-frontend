import { Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Card from '~/components/card/Card';
import { useCompose } from './ComposeProvider';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import AdvancedPoolComposeTokens from './AdvancedPoolComposeTokens';
import { AdvancedPoolComposeFees } from './AdvancedPoolComposeFees';
import { AdvancedPoolComposeFeeManager } from './AdvancedPoolComposeFeeManager';
import { AdvancedPoolComposeSubmit } from './AdvancedPoolComposeSubmit';
import { AdvancedPoolComposeName } from './AdvancedPoolComposeName';
import AdvancedPoolComposeProgress from './AdvancedPoolComposeProgress';

interface Props {}

export default function AdvancedPoolCreation(props: Props) {
    return (
        <VStack spacing="4" width="full" mb="10">
            <VStack width={{ base: '100%', md: '75%' }} alignItems="center">
                <AdvancedPoolComposeTokens />
                <AdvancedPoolComposeProgress step={0} />
                <AdvancedPoolComposeFees />
                <AdvancedPoolComposeProgress step={1} />
                <AdvancedPoolComposeFeeManager />
                {/* TODO IMPLEMENT SUBMISSION PREREQUISITES AND VALIDATION */}
                <AdvancedPoolComposeProgress step={2} />
                <AdvancedPoolComposeName />
                <AdvancedPoolComposeProgress step={3} />
                <AdvancedPoolComposeSubmit />
            </VStack>
        </VStack>
    );
}
