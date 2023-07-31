import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';

interface Props {}

export function AdvancedPoolComposeSubmit(props: Props) {
    const { setActiveStep } = useCompose();

    function goToPreview() {
        // TODO validate inputs
        setActiveStep('preview');
    }
    return (
        <VStack width="full">
            <Button onClick={goToPreview} width="full" variant="primary">
                Preview
            </Button>
        </VStack>
    );
}
