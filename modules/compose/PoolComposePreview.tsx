import { HStack, Heading, IconButton, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import PreviewPoolTokenSelections from './PreviewPoolTokenSelections';
import PreviewPoolTokenFees from './PreviewPoolTokenFees';
import FinalisePoolComposeActions from './FinalisePoolComposeActions';
import { ChevronLeft } from 'react-feather';
import { useCompose } from './ComposeProvider';

interface Props {}

export default function PoolComposePreview(props: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { setActiveStep, poolName, isCreationComplete, resetPoolCreationState } = useCompose();

    function goBack() {
        setActiveStep('choose-tokens');
        if (isCreationComplete) {
            resetPoolCreationState();
        }
    }

    return (
        <VStack spacing="4" width="full">
            <VStack spacing="4" width={{ base: '100%', md: '75%' }} alignItems="flex-start">
                <VStack position="relative" spacing="1">
                    {!isMobile && (
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
                    )}
                    <HStack width="full">
                        {isMobile && (
                            <IconButton
                                aria-label={'back-button'}
                                icon={<ChevronLeft />}
                                variant="ghost"
                                p="0"
                                width="32px"
                                height="32px"
                                minWidth="32px"
                                onClick={goBack}
                            />
                        )}
                        <Heading width="full" textAlign="left" size="md">
                            Preview your pool - {poolName}
                        </Heading>
                    </HStack>
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
