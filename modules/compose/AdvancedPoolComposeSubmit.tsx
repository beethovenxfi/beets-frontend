import { Button, VStack } from '@chakra-ui/react';
import React from 'react';

interface Props {}

export function AdvancedPoolComposeSubmit(props: Props) {
    return (
        <VStack width="full">
            <Button width='full' variant="primary">Preview</Button>
        </VStack>
    );
}
