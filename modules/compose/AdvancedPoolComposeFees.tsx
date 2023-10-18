import React from 'react';
import { useCompose } from './ComposeProvider';
import Card from '~/components/card/Card';
import { Alert, Box, Button, HStack, Heading, Stack, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { BeetsInput } from '~/components/inputs/BeetsInput';

interface Props {}

export function AdvancedPoolComposeFees(props: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { FEE_PRESETS, setCurrentFee, currentFee, setIsUsingCustomFee, isUsingCustomFee, getPoolFeeValidations } =
        useCompose();

    const { isValid, isFeeEmpty, isFeeZero, isFeeValid } = getPoolFeeValidations();

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
        const to2DP = event.currentTarget.value.match(/^(\d*\.{0,1}\d{0,2}$)/);
        setIsUsingCustomFee(true);
        if (to2DP) {
            setCurrentFee(event.currentTarget.value);
        }
    }

    function getInputBorderColour() {
        if (!isValid) {
            return 'red.400';
        }
        if (isUsingCustomFee) {
            return 'beets.green';
        }
        return 'transparent';
    }

    return (
        <Card py="3" px="3" width="full" height="full">
            <VStack alignItems="flex-start" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">2. Pool Fees</Heading>
                    <Text lineHeight="1rem" fontSize="0.95rem">
                        0.30% is best for most weighted pools with established tokens. Go higher for more exotic tokens.
                        You can also specify your own custom fee.
                    </Text>
                </VStack>
                <Stack
                    width="full"
                    height={{ base: 'fit-content', md: '40px' }}
                    direction={{ base: 'column', md: 'row' }}
                >
                    {FEE_PRESETS.map((preset) => (
                        <Button
                            onClick={() => handlePresetClicked(preset)}
                            // walpha.300 is default button colour
                            borderColor={isActivePreset(preset) ? 'beets.green' : 'transparent'}
                            borderWidth={2}
                            fontWeight="medium"
                            width={{ base: '100%', md: '75px' }}
                            key={`pool-fee-preset-${preset}`}
                        >
                            {preset}%
                        </Button>
                    ))}
                    <BeetsInput
                        wrapperProps={{
                            height: '100%',
                            padding: 'none',
                            width: isMobile ? '100%' : '100px',
                            minHeight: '40px',
                        }}
                        height="100%"
                        width={{ base: '100%', md: '100px' }}
                        py="0"
                        minHeight="40px"
                        fontWeight="medium"
                        fontSize="1rem"
                        px="2"
                        placeholder="0.1"
                        textAlign={{ base: 'center', md: 'left' }}
                        onChange={handleCustomFeeChanged}
                        borderColor={getInputBorderColour()}
                        borderWidth={2}
                        value={isUsingCustomFee ? currentFee : undefined}
                    >
                        <Box top="0" bottom="0" transform="translateY(20%)" right="12px" position="absolute">
                            <Text>%</Text>
                        </Box>
                    </BeetsInput>
                </Stack>
                {isFeeEmpty && (
                    <Alert status="error">Please ensure that you have selected or filled in a pool fee.</Alert>
                )}
                {isFeeZero && <Alert status="error">The pool fee cannot be zero.</Alert>}
                {!isFeeValid && <Alert status="error">The pool fee must be less than 10%.</Alert>}
            </VStack>
        </Card>
    );
}
