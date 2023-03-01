import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useEffect, useState } from 'react';
import { HorizontalSteps, StepStatus } from '~/components/steps/HorizontalSteps';
import { Alert, AlertIcon, Box, Button, Flex, Skeleton, Portal } from '@chakra-ui/react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { BeetsBatchRelayerApprovalButton } from './BeetsBatchRelayerApprovalButton';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';

export type TransactionStep = TransactionTokenApprovalStep | TransactionOtherStep;

interface TransactionStepBase {
    id: string;
    buttonText: string;
    tooltipText: string;
}

interface TransactionTokenApprovalStep extends TransactionStepBase {
    type: 'tokenApproval';
    token: TokenBaseWithAmount;
    contractToApprove?: string;
}

interface TransactionOtherStep extends TransactionStepBase {
    type: 'other';
}

interface Props {
    isLoading: boolean;
    loadingButtonText: string;
    completeButtonText: string;
    onCompleteButtonClick: () => void;
    onSubmit: (id: string) => void;
    onConfirmed: (id: string) => void;
    isDisabled?: boolean;

    steps: TransactionStep[];
    queries: (Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'> & { id: string })[];
    buttonSize?: string;

    onComplete?: () => void;
}

export function BeetsTransactionStepsSubmit({
    isLoading,
    loadingButtonText,
    completeButtonText,
    onCompleteButtonClick,
    steps,
    onSubmit,
    onConfirmed,
    onComplete,
    queries,
    isDisabled,
    buttonSize = 'lg',
}: Props) {
    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const [stepStatuses, setStepStatuses] = useState<{ [id: string]: StepStatus }>({});
    const currentStep = steps ? steps[currentStepIdx] : null;
    const currentQuery = queries.find((query) => query.id === currentStep?.id);
    const [complete, setComplete] = useState(false);
    const { refetch: refetchBatchRelayerApproval, data: hasBatchRelayerApproval } = useHasBatchRelayerApproval();

    function setStepStatus(id: string, status: StepStatus) {
        setStepStatuses({ ...stepStatuses, [id]: status });
    }

    function internalOnConfirmed() {
        if (!currentStep) {
            return;
        }

        if (steps[currentStepIdx + 1]) {
            setStepStatuses({
                ...stepStatuses,
                [currentStep.id]: 'complete',
                [steps[currentStepIdx + 1].id]: 'current',
            });
        } else {
            setStepStatus(currentStep.id, 'complete');
        }

        onConfirmed(currentStep.id);

        if (currentStepIdx === steps.length - 1) {
            setComplete(true);
        }

        if (steps[currentStepIdx + 1]) {
            setCurrentStepIdx(currentStepIdx + 1);
        }
    }

    useEffect(() => {
        if (complete) {
            onComplete && onComplete();
        }
    }, [complete]);

    return (
        <Box>
            {isLoading && !complete ? (
                <Flex justifyContent="center" mb="6">
                    <Skeleton height="30px" width="180px" />
                </Flex>
            ) : steps && steps.length > 1 ? (
                <HorizontalSteps
                    mb="6"
                    steps={steps.map((step) => ({
                        ...step,
                        status: stepStatuses[step.id] || 'idle',
                    }))}
                />
            ) : null}
            {isLoading && !complete ? (
                <Button
                    variant="primary"
                    isLoading={true}
                    loadingText={loadingButtonText}
                    width="full"
                    size={buttonSize}
                >
                    {loadingButtonText}
                </Button>
            ) : null}
            {steps && currentStep && currentStep.id === 'batch-relayer' && !complete ? (
                <BeetsBatchRelayerApprovalButton
                    onSubmitting={() => setStepStatus(currentStep.id, 'submitting')}
                    onPending={() => setStepStatus(currentStep.id, 'pending')}
                    onCanceled={() => setStepStatus(currentStep.id, 'current')}
                    onConfirmed={() => {
                        refetchBatchRelayerApproval();
                        internalOnConfirmed();
                    }}
                    buttonText={currentStep.buttonText}
                />
            ) : null}
            {steps && currentStep && currentStep.type === 'tokenApproval' && !complete ? (
                <BeetsTokenApprovalButton
                    tokenWithAmount={currentStep.token}
                    contractToApprove={currentStep.contractToApprove}
                    onConfirmed={internalOnConfirmed}
                    onSubmitting={() => setStepStatus(currentStep.id, 'submitting')}
                    onPending={() => setStepStatus(currentStep.id, 'pending')}
                    onCanceled={() => setStepStatus(currentStep.id, 'current')}
                    isDisabled={isDisabled}
                    size={buttonSize}
                />
            ) : null}
            {!isLoading && currentStep && currentStep.type !== 'tokenApproval' && currentQuery && !complete ? (
                <BeetsSubmitTransactionButton
                    {...currentQuery}
                    width="full"
                    onClick={() => onSubmit(currentStep.id)}
                    onSubmitting={() => setStepStatus(currentStep.id, 'submitting')}
                    onPending={() => setStepStatus(currentStep.id, 'pending')}
                    onCanceled={() => setStepStatus(currentStep.id, 'current')}
                    onConfirmed={internalOnConfirmed}
                    isDisabled={isDisabled}
                    size={buttonSize}
                >
                    {currentStep.buttonText}
                </BeetsSubmitTransactionButton>
            ) : null}
            {complete && (
                <Button
                    onClick={() => {
                        setStepStatuses({});
                        setComplete(false);
                        onCompleteButtonClick();
                    }}
                    width="full"
                    variant="outline"
                    size={buttonSize}
                >
                    {completeButtonText}
                </Button>
            )}
            {currentQuery && currentQuery.submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    {transactionMessageFromError(currentQuery.submitError)}
                </Alert>
            ) : null}
            {complete && (
                <Portal>
                    <Box position="absolute" top="0" left="0" width="full">
                        <div className="fireworks">
                            <div className="before" />
                            <div className="after" />
                        </div>
                    </Box>
                </Portal>
            )}
        </Box>
    );
}
