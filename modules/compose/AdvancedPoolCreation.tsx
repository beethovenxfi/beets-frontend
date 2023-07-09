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
    const { poolTypes } = useCompose();

    return (
        <VStack spacing="4" width="full">
            <Heading size="md">Advanced Pool Creation</Heading>
            <Card width="75%">
                <HStack spacing="0">
                    {poolTypes.map((poolType) => (
                        <BeetsTooltip
                            key={`choose-pooltye-${poolType.type}`}
                            noImage
                            label={
                                !poolType.isEnabled ? 'This pool type is not supported by the compose UI yet.' : null
                            }
                        >
                            <Box width="full">
                                <Button
                                    disabled={!poolType.isEnabled}
                                    fontSize="0.85rem"
                                    width="full"
                                    roundedRight="none"
                                    py="6"
                                >
                                    <VStack spacing="0">
                                        <Text>{poolType.name}</Text>
                                        {!poolType.isEnabled && (
                                            <Text fontSize="0.85rem" color="orange.300" fontWeight="regular">
                                                Under production
                                            </Text>
                                        )}
                                    </VStack>
                                </Button>
                            </Box>
                        </BeetsTooltip>
                    ))}
                </HStack>
            </Card>
            <HStack width="75%" alignItems="flex-start">
                <Box width="full">
                    {/* TODO ADD WEIGHTS */}
                    <AdvancedPoolComposeTokens />
                </Box>
                <VStack width="full">
                    <AdvancedPoolComposeFees />
                    <AdvancedPoolComposeFeeManager />
                    {/* TODO IMPLEMENT SUBMISSION PREREQUISITES AND VALIDATION */}
                    <AdvancedPoolComposeSubmit />
                </VStack>
            </HStack>
        </VStack>
    );
}
