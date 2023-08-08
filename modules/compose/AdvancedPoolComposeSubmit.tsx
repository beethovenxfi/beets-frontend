import { Alert, Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';
import { sumBy } from 'lodash';
import { isAddress } from 'ethers/lib/utils.js';

interface Props {}

export function AdvancedPoolComposeSubmit(props: Props) {
    const { setActiveStep, tokens, feeManager, isPoolNameValid, getPoolFeeValidations, getTokenAndWeightValidations } =
        useCompose();

    const totalTokenWeight = sumBy(tokens, (token) => token.weight);
    const isInvalidTokenWeighTotal = totalTokenWeight < 100;
    const isInvalidFeeManager = feeManager === null || feeManager === '' || !isAddress(feeManager);
    const isPreviewDisabled =
        isInvalidTokenWeighTotal ||
        isInvalidFeeManager ||
        !getTokenAndWeightValidations().isValid ||
        !getPoolFeeValidations().isValid ||
        !isPoolNameValid();
    function goToPreview() {
        // TODO validate inputs
        setActiveStep('preview');
    }

    return (
        <VStack width="full">
            <Button isDisabled={isPreviewDisabled} onClick={goToPreview} width="full" variant="primary">
                Preview
            </Button>
        </VStack>
    );
}
