import { Box, Button, ButtonProps, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import BeetsThinking from '~/assets/icons/beetx-smarts.svg';
import Image from 'next/image';
import { useCompose } from './ComposeProvider';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {}

function FlowTypeChoiceButton({ onClick, children, ...rest }: ButtonProps) {
    return (
        <Button
            as={motion.div}
            animate={{
                opacity: 1,
                transition: { delay: 0.2, type: 'spring', stiffness: 2000 },
            }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            _hover={{ borderColor: 'beets.green' }}
            borderWidth={1}
            borderColor="beets.transparent"
            whiteSpace="normal"
            p="4"
            width="350px"
            height="250px"
            onClick={onClick}
            textAlign='center'
            {...rest}
        >
            {children}
        </Button>
    );
}

export default function ComposeChooseFlowType(props: Props) {
    const { setActiveStep, setCreationExperience } = useCompose();

    function setAdvancedExperience() {
        setCreationExperience('advanced');
    }

    function setSimpleExperience() {
        setCreationExperience('simple');
    }

    return (
        <AnimatePresence>
            <HStack width="full" justifyContent="center" pt="6" pb="6">
                <VStack spacing="8" width="full" alignItems="center">
                    <VStack spacing="1">
                        <Heading size="md">Choose your creation experience</Heading>
                        <Text>
                            You can choose to create a pool in two different ways. If you change your mind you can
                            always come back and switch flows.
                        </Text>
                    </VStack>

                    <HStack spacing="4">
                        <FlowTypeChoiceButton onClick={setSimpleExperience}>
                            <VStack width="full" alignItems="center" justifyContent="center">
                                <Image width="75px" height="75px" src={BeetsThinking} alt="thinking-emoji" />

                                <Heading size="sm">Simple</Heading>
                                <Text fontSize="0.95rem" fontWeight="normal">
                                    If it's your first time creating a pool, or if you simply enjoy doing things step by
                                    step.
                                </Text>
                            </VStack>
                        </FlowTypeChoiceButton>
                        <FlowTypeChoiceButton onClick={setAdvancedExperience}>
                            <VStack width="full" alignItems="center" justifyContent="center">
                                <Image width="75px" height="75px" src={BeetsThinking} alt="thinking-emoji" />

                                <Heading size="sm">Advanced</Heading>
                                <Text fontSize="0.95rem" fontWeight="normal">
                                    You're a seasoned professional, a one page pool creation experience for advanced
                                    users.
                                </Text>
                            </VStack>
                        </FlowTypeChoiceButton>
                    </HStack>
                </VStack>
            </HStack>
        </AnimatePresence>
    );
}
