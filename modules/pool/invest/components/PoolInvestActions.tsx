import { BoxProps } from '@chakra-ui/react';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { useEffect, useState } from 'react';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';

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

interface Props extends BoxProps {
    onInvestComplete(): void;
}

export function PoolInvestActions({ onInvestComplete, ...rest }: Props) {
    const { pool } = usePool();
    const { selectedInvestTokensWithAmounts } = useInvest();
    const joinQuery = useJoinPool(pool);
    const allInvestTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const {
        hasApprovalForAmount,
        isLoading,
        refetch: refetchUserAllowances,
    } = useUserAllowances(allInvestTokens, networkConfig.balancer.vault);
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const { bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData } = usePoolJoinGetContractCallData(bptOutAndPriceImpact?.minBptReceived || null);

    useEffect(() => {
        if (!isLoading) {
            const tokensRequiringApproval = selectedInvestTokensWithAmounts.filter(
                (tokenWithAmount) => !hasApprovalForAmount(tokenWithAmount.address, tokenWithAmount.amount),
            );

            const steps: TransactionStep[] = [
                ...tokensRequiringApproval.map((token) => ({
                    id: token.symbol,
                    type: 'tokenApproval' as const,
                    buttonText: `Approve ${token.symbol}`,
                    tooltipText: `Approve ${token.symbol} for investing`,
                    token,
                })),
                {
                    id: 'invest',
                    type: 'other',
                    buttonText: 'Invest',
                    tooltipText: 'Confirm investment into this pool',
                },
            ];

            setSteps(steps);
        }
    }, [isLoading]);

    /*return (
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
                <BeetsTokenApprovalButton
                    tokenWithAmount={currentStep.token}
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
            {currentStep && currentStep.type === 'invest' && !isConfirmed ? (
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
            {isConfirmed && (
                <BeetsButton onClick={onInvestComplete} isFullWidth buttonType="secondary">
                    Return to pool
                </BeetsButton>
            )}
            {submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    An error occurred: {submitError.message}
                </Alert>
            ) : null}
            {isConfirmed && (
                <div className="fireworks">
                    <div className="before" />
                    <div className="after" />
                </div>
            )}
        </Box>
    );*/

    return (
        <BeetsTransactionStepsSubmit
            isLoading={steps === null}
            loadingButtonText="Invest"
            completeButtonText="Return to pool"
            onCompleteButtonClick={onInvestComplete}
            steps={steps || []}
            onSubmit={(id) => {
                if (id === 'invest' && contractCallData) {
                    joinQuery.joinPool(contractCallData, selectedInvestTokensWithAmounts);
                }
            }}
            onConfirmed={(id) => {
                if (id !== 'invest') {
                    refetchUserAllowances();
                }
            }}
            queries={[{ ...joinQuery, id: 'invest' }]}
        />
    );
}
