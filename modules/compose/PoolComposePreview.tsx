import { Box, Button, HStack, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Card from '~/components/card/Card';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { AdvancedPoolComposeFeeManager } from './AdvancedPoolComposeFeeManager';
import { AdvancedPoolComposeFees } from './AdvancedPoolComposeFees';
import { AdvancedPoolComposeSubmit } from './AdvancedPoolComposeSubmit';
import AdvancedPoolComposeTokens from './AdvancedPoolComposeTokens';
import PreviewPoolTokenSelections from './PreviewPoolTokenSelections';
import PreviewPoolTokenFees from './PreviewPoolTokenFees';
import FinalisePoolComposeActions from './FinalisePoolComposeActions';
import { ChevronLeft } from 'react-feather';
import { useCompose } from './ComposeProvider';

interface Props {}

export default function PoolComposePreview(props: Props) {
    const { setActiveStep, poolName } = useCompose();

    function goBack() {
        setActiveStep('choose-tokens');
    }

    return (
        <VStack spacing="4" width="full">
            <VStack spacing="4" width="75%" alignItems="flex-start">
                <VStack position="relative" spacing="1">
                    <IconButton
                        aria-label={'back-button'}
                        icon={<ChevronLeft />}
                        variant="ghost"
                        p="0"
                        width="32px"
                        height="32px"
                        minWidth="32px"
                        position="absolute"
                        top="0"
                        left="-40px"
                        onClick={goBack}
                    />
                    <Heading width="full" textAlign="left" size="md">
                        Preview your pool - {poolName}
                    </Heading>
                    <Text fontSize="0.95rem">
                        Verify your pool fee and token selections before finalising pool creation. You can go back and
                        change your selections as well.
                    </Text>
                </VStack>
                <VStack width="full">
                    <PreviewPoolTokenFees />
                    <PreviewPoolTokenSelections />
                    <FinalisePoolComposeActions />
                </VStack>
            </VStack>
        </VStack>
    );
}
