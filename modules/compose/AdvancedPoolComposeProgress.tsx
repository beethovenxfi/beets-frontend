import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChevronDown } from 'react-feather';
import { useCompose } from './ComposeProvider';

interface Props {
    step: number;
}

export default function AdvancedPoolComposeProgress({ step }: Props) {
    const { progressValidatedTo } = useCompose();

    const chevronColour = progressValidatedTo > step ? 'green.500' : 'red.500';
    return (
        <Box py="2" color={chevronColour}>
            <ChevronDown />
        </Box>
    );
}
