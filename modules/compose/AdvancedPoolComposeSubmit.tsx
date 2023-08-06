import { Alert, Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';
import { sumBy } from 'lodash';
import { isAddress } from 'ethers/lib/utils.js';

interface Props {}

export function AdvancedPoolComposeSubmit(props: Props) {
    const { setActiveStep, tokens, feeManager } = useCompose();

    const totalTokenWeight = sumBy(tokens, (token) => token.weight);
    const isInvalidTokenWeighTotal = totalTokenWeight < 100;
    const isInvalidFeeManager = feeManager === null || feeManager === '' || !isAddress(feeManager);
    const isPreviewDisabled = isInvalidTokenWeighTotal || isInvalidFeeManager;

    function goToPreview() {
        // TODO validate inputs
        setActiveStep('preview');
    }

    return (
        <VStack width="full">
            {isInvalidTokenWeighTotal && (
                <Alert status="error">Please ensure that all the token weights in the pool sum to 100%.</Alert>
            )}
            {isInvalidFeeManager && (
                <Alert status="error">Please make sure that the fee manager address is correct.</Alert>
            )}
            <Button isDisabled={isPreviewDisabled} onClick={goToPreview} width="full" variant="primary">
                Preview
            </Button>
        </VStack>
    );
}
