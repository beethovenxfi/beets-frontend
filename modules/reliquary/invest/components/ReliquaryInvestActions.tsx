import React, { useEffect, useState } from 'react';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useReliquaryInvest } from '~/modules/reliquary/invest/lib/useReliquaryInvest';
import { Alert, AlertIcon, Box, VStack } from '@chakra-ui/react';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { SubTransactionSubmittedContent } from '~/components/transaction/SubTransactionSubmittedContent';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { useReliquaryDepositContractCallData } from '~/modules/reliquary/lib/useReliquaryDepositContractCallData';
import { useReliquaryZap } from '~/modules/reliquary/lib/useReliquaryZap';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { useBatchRelayerHasApprovedForAll } from '~/modules/reliquary/lib/useBatchRelayerHasApprovedForAll';
import { ReliquaryTransactionStepsSubmit, TransactionStep } from '../../components/ReliquaryTransactionStepsSubmit';
import { useTranslation } from 'next-i18next';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function ReliquaryInvestActions({ onInvestComplete, onClose }: Props) {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();
    const { selectedInvestTokensWithAmounts, totalInvestValue } = useReliquaryInvest();
    const allInvestTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const {
        hasApprovalForAmount,
        isLoading: isLoadingUserAllowances,
        refetch: refetchUserAllowances,
    } = useUserAllowances(allInvestTokens, networkConfig.balancer.vault);
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const {
        data: hasBatchRelayerApproval,
        isLoading: isLoadingBatchRelayerApproval,
        refetch: refetchBatchRelayerApproval,
    } = useHasBatchRelayerApproval();

    const { createRelic, refetchRelicPositions } = useReliquary();
    const { reliquaryZap, ...reliquaryJoinQuery } = useReliquaryZap('DEPOSIT');
    const {
        data: batchRelayerHasApprovedForAll,
        isLoading: isLoadingBatchRelayerHasApprovedForAll,
        refetch: refetchBatchRelayerHasApprovedForAll,
    } = useBatchRelayerHasApprovedForAll();
    const { data: reliquaryContractCalls } = useReliquaryDepositContractCallData({
        investTokensWithAmounts: selectedInvestTokensWithAmounts,
        enabled: batchRelayerHasApprovedForAll,
    });
    const { t } = useTranslation('reliquary');

    const isLoading =
        isLoadingUserAllowances || isLoadingBatchRelayerApproval || isLoadingBatchRelayerHasApprovedForAll;

    useEffect(() => {
        refetchBatchRelayerApproval({});
        refetchBatchRelayerHasApprovedForAll({});
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const tokensRequiringApproval = selectedInvestTokensWithAmounts.filter(
                (tokenWithAmount) =>
                    parseFloat(tokenWithAmount.amount) > 0 &&
                    !hasApprovalForAmount(tokenWithAmount.address, tokenWithAmount.amount),
            );

            const investStep: TransactionStep = {
                id: 'reliquary-invest',
                type: 'other',
                buttonText: `${
                    createRelic
                        ? t('reliquary.invest.actions.invest.buttonTrue')
                        : t('reliquary.invest.actions.invest.buttonFalse')
                }`,
                tooltipText: t('reliquary.invest.actions.invest.toolTip'),
            };

            const steps: TransactionStep[] = [
                ...tokensRequiringApproval.map((token) => ({
                    id: token.symbol,
                    type: 'tokenApproval' as const,
                    buttonText: t('reliquary.invest.actions.tokenApproval.button', { token: token.symbol }),
                    tooltipText: t('reliquary.invest.actions.tokenApproval.toolTip', { token: token.symbol }),
                    token,
                })),
                investStep,
            ];

            if (!batchRelayerHasApprovedForAll) {
                steps.unshift({
                    id: 'batch-relayer-reliquary',
                    type: 'other',
                    buttonText: t('reliquary.invest.actions.batchRelayerApprovedForAll.button'),
                    tooltipText: t('reliquary.invest.actions.batchRelayerApprovedForAll.toolTip'),
                });
            }

            if (!hasBatchRelayerApproval) {
                steps.unshift({
                    id: 'batch-relayer',
                    type: 'other',
                    buttonText: t('reliquary.invest.actions.batchRelayerApproval.button'),
                    tooltipText: t('reliquary.invest.actions.batchRelayerApproval.toolTip'),
                });
            }

            setSteps(steps);
        }
    }, [isLoading]);

    return (
        <VStack width="full" spacing="4">
            {reliquaryJoinQuery.error && (
                <Box width="full" px="4">
                    <Alert width="full" status="error">
                        <AlertIcon />
                        {transactionMessageFromError(reliquaryJoinQuery.error)}
                    </Alert>
                </Box>
            )}
            {reliquaryJoinQuery.isConfirmed && (
                <Box width="full" px="4">
                    <FadeInBox isVisible={reliquaryJoinQuery.isConfirmed}>
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            {t('reliquary.invest.actions.confirmed', {
                                totalInvestValue: numberFormatUSDValue(totalInvestValue),
                            })}
                        </Alert>
                    </FadeInBox>
                </Box>
            )}
            <Box
                px="4"
                width="full"
                pb={
                    reliquaryJoinQuery.isConfirmed || reliquaryJoinQuery.isFailed || reliquaryJoinQuery.isPending
                        ? '0'
                        : '4'
                }
            >
                <ReliquaryTransactionStepsSubmit
                    isLoading={
                        steps === null || isLoadingBatchRelayerApproval || isLoadingBatchRelayerHasApprovedForAll
                    }
                    loadingButtonText={t('reliquary.invest.actions.loading')}
                    completeButtonText={t('reliquary.invest.actions.complete')}
                    onCompleteButtonClick={onClose}
                    steps={steps || []}
                    onSubmit={(id) => {
                        if (id === 'reliquary-invest' && reliquaryContractCalls) {
                            reliquaryZap(reliquaryContractCalls);
                        }
                    }}
                    onConfirmed={(id) => {
                        if (id !== 'reliquary-invest') {
                            refetchUserAllowances();
                        } else {
                            refetchRelicPositions();
                            onInvestComplete();
                        }
                    }}
                    queries={[{ ...reliquaryJoinQuery, id: 'reliquary-invest' }]}
                />
            </Box>
            <FadeInBox
                width="full"
                isVisible={
                    reliquaryJoinQuery.isConfirmed || reliquaryJoinQuery.isPending || reliquaryJoinQuery.isFailed
                }
            >
                <SubTransactionSubmittedContent query={reliquaryJoinQuery} />
            </FadeInBox>
        </VStack>
    );
}
