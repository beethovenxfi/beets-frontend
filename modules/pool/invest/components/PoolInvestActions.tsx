import { Alert, AlertIcon, Box, BoxProps, Flex } from '@chakra-ui/react';
import { HorizontalSteps } from '~/components/steps/HorizontalSteps';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { useEffect, useState } from 'react';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
import BeetsButton from '~/components/button/Button';
import { PoolInvestActionTokenApproval } from '~/modules/pool/invest/components/PoolInvestActionTokenApproval';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';

type Status = 'current' | 'idle' | 'submitting' | 'pending' | 'complete';
type Step = TokenApprovalStep | ContractApprovalStep | InvestStep;

interface BaseStep {
    id: string;
    buttonText: string;
    tooltipText: string;
}

interface TokenApprovalStep extends BaseStep {
    type: 'tokenApproval';
    token: TokenBaseWithAmount;
}

interface ContractApprovalStep extends BaseStep {
    type: 'contractApproval';
    contractAddress: string;
}

interface InvestStep extends BaseStep {
    type: 'invest';
}

interface Props extends BoxProps {}

export function PoolInvestActions({ ...rest }: Props) {
    const { pool } = usePool();
    const { selectedInvestTokensWithAmounts, isInvestingWithEth } = useInvest();
    const { joinPool, isSubmitting, isPending, submitError } = useJoinPool(pool);
    const allInvestTokens = pool.investConfig.options.map((option, index) => option.tokenOptions).flat();
    const {
        hasApprovalForAmount,
        isLoading,
        refetch: refetchUserAllowances,
    } = useUserAllowances(allInvestTokens, networkConfig.balancer.vault);
    const [steps, setSteps] = useState<Step[] | null>(null);
    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const [stepStatuses, setStepStatuses] = useState<{ [id: string]: Status }>({});
    const { data: bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData } = usePoolJoinGetContractCallData(bptOutAndPriceImpact?.minBptReceived || null);

    function setStepStatus(id: string, status: Status) {
        setStepStatuses({ ...stepStatuses, [id]: status });
    }

    const loading = isLoading;

    useEffect(() => {
        if (!isLoading) {
            const tokensRequiringApproval = selectedInvestTokensWithAmounts.filter(
                (tokenWithAmount) => !hasApprovalForAmount(tokenWithAmount.address, tokenWithAmount.amount),
            );

            const steps: Step[] = [
                ...tokensRequiringApproval.map((token) => ({
                    id: token.symbol,
                    type: 'tokenApproval' as const,
                    buttonText: `Approve ${token.symbol}`,
                    tooltipText: `Approve ${token.symbol} for investing`,
                    token,
                })),
                {
                    id: 'invest',
                    type: 'invest',
                    buttonText: 'Invest',
                    tooltipText: 'Confirm investment into this pool',
                },
            ];

            setSteps(steps);
            setStepStatuses({ [steps[0].id]: 'current' });
        }
    }, [loading]);

    const currentStep = steps ? steps[currentStepIdx] : null;

    return (
        <Box {...rest}>
            {loading ? (
                <Flex justifyContent="center">
                    <BeetsSkeleton height="30px" width="180px" />
                </Flex>
            ) : steps && steps.length > 1 ? (
                <HorizontalSteps
                    mb="6"
                    steps={(steps || []).map((step) => ({
                        ...step,
                        status: stepStatuses[step.id] || 'idle',
                    }))}
                />
            ) : null}
            {loading ? (
                <BeetsButton isLoading={true} isFullWidth>
                    Invest
                </BeetsButton>
            ) : null}
            {steps && currentStep && currentStep.type === 'tokenApproval' ? (
                <PoolInvestActionTokenApproval
                    token={currentStep.token}
                    onConfirmed={() => {
                        setStepStatuses({
                            ...stepStatuses,
                            [currentStep.id]: 'complete',
                            [steps[currentStepIdx + 1].id]: 'current',
                        });

                        refetchUserAllowances();
                        setCurrentStepIdx(currentStepIdx + 1);
                    }}
                    onSubmitting={() => setStepStatus(currentStep.id, 'submitting')}
                    onPending={() => setStepStatus(currentStep.id, 'pending')}
                    onCanceled={() => setStepStatus(currentStep.id, 'current')}
                />
            ) : null}
            {currentStep && currentStep.type === 'invest' ? (
                <BeetsSubmitTransactionButton
                    isFullWidth
                    isSubmitting={isSubmitting}
                    isPending={isPending}
                    onClick={() => {
                        if (contractCallData) {
                            joinPool(contractCallData, selectedInvestTokensWithAmounts);
                        }
                    }}
                >
                    Invest
                </BeetsSubmitTransactionButton>
            ) : null}
            {submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    An error occurred: {submitError.message}
                </Alert>
            ) : null}
        </Box>
    );
}
