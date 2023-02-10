import { Box } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useCurrentStep } from '../../lib/useReliquaryCurrentStep';

export function ReliquaryInvestImage() {
    const { currentStep } = useCurrentStep();
    console.log({ currentStep });

    return <Box w="full">{currentStep}</Box>;
}
