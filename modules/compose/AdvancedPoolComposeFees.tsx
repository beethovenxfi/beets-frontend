import React from 'react';
import { useCompose } from './ComposeProvider';
import Card from '~/components/card/Card';
import { Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { BeetsInput } from '~/components/inputs/BeetsInput';

interface Props {}

export function AdvancedPoolComposeFees(props: Props) {
    const { FEE_PRESETS, setCurrentFee, currentFee, setIsUsingCustomFee, isUsingCustomFee } = useCompose();

    function handleFeeChanged(preset: string) {
        setCurrentFee(preset);
    }

    function isActivePreset(preset: string) {
        if (!isUsingCustomFee) {
            if (currentFee === preset) {
                return true;
            }
        }
        return false;
    }

    function handlePresetClicked(preset: string) {
        setIsUsingCustomFee(false);
        handleFeeChanged(preset);
    }

    function handleCustomFeeChanged(event: { currentTarget: { value: string } }) {
        setIsUsingCustomFee(true);
        setCurrentFee(event.currentTarget.value);
    }

    return (
        <Card py="3" px="3" width='full' height='full'>
            <VStack alignItems="flex-start" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">Pool Fees</Heading>
                    <Text lineHeight="1rem" fontSize="0.85rem">
                        0.30% is best for most weighted pools with established tokens. Go higher for more exotic tokens.
                        You can also specify your own custom fee.
                    </Text>
                </VStack>
                <HStack height="40px">
                    {FEE_PRESETS.map((preset) => (
                        <Button
                            onClick={() => handlePresetClicked(preset)}
                            // walpha.300 is default button colour
                            borderColor={isActivePreset(preset) ? 'beets.green' : 'transparent'}
                            borderWidth={2}
                            fontWeight="medium"
                            width="75px"
                            key={`pool-fee-preset-${preset}`}
                        >
                            {parseFloat(preset) * 100}%
                        </Button>
                    ))}
                    <BeetsInput
                        wrapperProps={{ height: '100%', padding: 'none', width: '100px' }}
                        height="100%"
                        width="100px"
                        py="0"
                        minHeight="none"
                        fontWeight="medium"
                        fontSize="1rem"
                        px="2"
                        placeholder="0.1"
                        onChange={handleCustomFeeChanged}
                        borderColor={isUsingCustomFee ? 'beets.green' : 'transparent'}
                        borderWidth={2}
                    >
                        <Box top="0" bottom="0" transform="translateY(20%)" right="12px" position="absolute">
                            <Text>%</Text>
                        </Box>
                    </BeetsInput>
                </HStack>
            </VStack>
        </Card>
    );
}
