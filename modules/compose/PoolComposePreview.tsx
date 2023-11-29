import { HStack, Heading, Highlight, IconButton, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import PreviewPoolTokenSelections from './PreviewPoolTokenSelections';
import PreviewPoolTokenFees from './PreviewPoolTokenFees';
import FinalisePoolComposeActions from './FinalisePoolComposeActions';
import { ChevronLeft } from 'react-feather';
import { useCompose } from './ComposeProvider';
import { BeetsBox } from '~/components/box/BeetsBox';
import { networkConfig } from '~/lib/config/network-config';

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
                <VStack position="relative" spacing="1" alignItems="flex-start">
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
                    <BeetsBox p="4">
                        {networkConfig.poolVerificationEnabled && (
                            <Text>
                                <Highlight
                                    query={['initialised', 'verified automatically', 'to complete before going']}
                                    styles={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    After the pool has been initialised it will be verified automatically on FTMScan.
                                    Please wait for the verification to complete before going to your pool.
                                </Highlight>
                            </Text>
                        )}
                        <Text mt={networkConfig.poolVerificationEnabled ? '16px' : '0'}>
                            <Highlight
                                query={['an error', 'Wait', 'refresh']}
                                styles={{ fontWeight: 'bold', color: 'white' }}
                            >
                                When you go to your pool page and you see an error, it means the data for it has not
                                been loaded in the backend. Wait for a couple of minutes and refresh the pool page
                                again.
                            </Highlight>
                        </Text>
                    </BeetsBox>
                </VStack>
                <VStack width="full" spacing="4">
                    <PreviewPoolTokenFees />
                    <PreviewPoolTokenSelections />
                    <FinalisePoolComposeActions />
                </VStack>
            </VStack>
        </VStack>
    );
}
