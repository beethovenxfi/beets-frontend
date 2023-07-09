import { Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Card from '~/components/card/Card';
import { useCompose } from './ComposeProvider';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import AdvancedPoolComposeTokens from './AdvancedPoolComposeTokens';

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
            <Box width="75%">
                <AdvancedPoolComposeTokens />
            </Box>
        </VStack>
    );
}
