import React, { useEffect, useState } from 'react';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { Alert, AlertIcon, Box, VStack } from '@chakra-ui/react';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { SubTransactionSubmittedContent } from '~/components/transaction/SubTransactionSubmittedContent';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { usePoolUserAuraStakingAllowance } from '../../lib/usePoolUserAuraStakingAllowance';
import { useJoinPoolAura } from '../lib/useJoinPoolAura';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { parseUnits } from 'ethers/lib/utils.js';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function PoolInvestActions({ onInvestComplete, onClose }: Props) {
    const networkConfig = useNetworkConfig();
    const { pool, requiresBatchRelayerOnJoin, auraPool, bpt } = usePool();
    const { selectedInvestTokensWithAmounts, totalInvestValue, zapEnabled, auraZapEnabled } = useInvest();
    const { joinPool, ...joinQuery } = useJoinPool(pool, zapEnabled);
    const { joinPoolAura, ...joinAuraQuery } = useJoinPoolAura(pool);
    const allInvestTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const {
        hasApprovalForAmount,
        isLoading: isLoadingUserAllowances,
        refetch: refetchUserAllowances,
    } = useUserAllowances(allInvestTokens, networkConfig.balancer.vault);
    const {
        hasApprovalToStakeAmount,
        isLoading: isLoadingAuraStakingAllowance,
        refetch: refetchAuraStakingAllowance,
    } = usePoolUserAuraStakingAllowance();
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const {
        data: hasBatchRelayerApproval,
        isLoading: isLoadingBatchRelayerApproval,
        refetch: refetchBatchRelayerApproval,
    } = useHasBatchRelayerApproval();

    const { bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData, isLoading: isLoadingContractCallData } = usePoolJoinGetContractCallData(
        bptOutAndPriceImpact?.minBptReceived || null,
        zapEnabled,
    );

    const { refetch: refetchUserTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { refetch: refetchUserBptBalance } = usePoolUserBptBalance();
    const [userSyncBalance] = useUserSyncBalanceMutation();

    const { approve, ...approveQuery } = useApproveToken(bpt);

    const isLoading =
        isLoadingUserAllowances ||
        isLoadingContractCallData ||
        isLoadingBatchRelayerApproval ||
        isLoadingAuraStakingAllowance;
    const isBatchRelayerApprovalRequired = !auraZapEnabled && (requiresBatchRelayerOnJoin || zapEnabled);

    useEffect(() => {
        refetchBatchRelayerApproval({});
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const tokensRequiringApproval = selectedInvestTokensWithAmounts.filter(
                (tokenWithAmount) =>
                    parseFloat(tokenWithAmount.amount) > 0 &&
                    !hasApprovalForAmount(tokenWithAmount.address, tokenWithAmount.amount),
            );

            const investStep: TransactionStep = {
                id: 'invest',
                type: 'other',
                buttonText: 'Invest',
                tooltipText: 'Invest into this pool',
            };

            const steps: TransactionStep[] = [
                ...tokensRequiringApproval.map((token) => ({
                    id: token.symbol,
                    type: 'tokenApproval' as const,
                    buttonText: `Approve ${token.symbol}`,
                    tooltipText: `Approve ${token.symbol} for investing`,
                    token,
                })),
                investStep,
            ];

            if (isBatchRelayerApprovalRequired && !hasBatchRelayerApproval) {
                steps.unshift({
                    id: 'batch-relayer',
                    type: 'other',
                    buttonText: 'Approve Batch Relayer',
                    tooltipText: 'This pool requires you to approve the batch relayer.',
                });
            }

            if (auraZapEnabled) {
                if (!hasApprovalToStakeAmount(bptOutAndPriceImpact?.minBptReceived || '0')) {
                    steps.push({
                        id: 'approve',
                        type: 'other' as const,
                        buttonText: 'Approve BPT for Aura',
                        tooltipText: 'Approve BPT Aura',
                    });
                }
                steps.push({
                    id: 'stake',
                    type: 'other' as const,
                    buttonText: 'Deposit & stake BPT in Aura',
                    tooltipText: 'Deposit & stake BPT in Aura',
                });
            }

            setSteps(steps);
        }
    }, [isLoading]);

    return (
        <VStack width="full" spacing="4">
            {joinQuery.error && (
                <Box width="full" px="4">
                    <Alert width="full" status="error">
                        <AlertIcon />
                        {transactionMessageFromError(joinQuery.error)}
                    </Alert>
                </Box>
            )}
            {joinQuery.isConfirmed && (
                <Box width="full" px="4">
                    <FadeInBox isVisible={joinQuery.isConfirmed}>
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            {`You've successfully invested ${numberFormatUSDValue(totalInvestValue)} into ${
                                pool.name
                            }.`}
                        </Alert>
                    </FadeInBox>
                </Box>
            )}
            <Box
                px="4"
                width="full"
                pb={joinQuery.isConfirmed || joinQuery.isFailed || joinQuery.isPending ? '0' : '4'}
            >
                <BeetsTransactionStepsSubmit
                    isLoading={steps === null || isLoadingBatchRelayerApproval}
                    loadingButtonText="Invest"
                    completeButtonText="Return to pool"
                    onCompleteButtonClick={onClose}
                    steps={steps || []}
                    onSubmit={(id) => {
                        if (id === 'approve') {
                            approve(networkConfig.aura.boosterLite || '');
                        } else if (id === 'invest' && contractCallData) {
                            joinPool(contractCallData, selectedInvestTokensWithAmounts);
                        } else if (id === 'stake') {
                            joinPoolAura(auraPool?.id, parseUnits(bptOutAndPriceImpact?.minBptReceived || '0', 18));
                        }
                    }}
                    onConfirmed={(id) => {
                        if (id === 'tokenApproval') {
                            refetchUserAllowances();
                        } else if (id === 'approve') {
                            refetchAuraStakingAllowance();
                        } else if (id === 'invest' || id === 'stake') {
                            refetchUserTokenBalances();
                            refetchUserBptBalance();
                            userSyncBalance({ variables: { poolId: pool.id } });
                            onInvestComplete();
                        }
                    }}
                    queries={[
                        { ...joinQuery, id: 'invest' },
                        { ...joinAuraQuery, id: 'stake' },
                        { ...approveQuery, id: 'approve' },
                    ]}
                />
            </Box>
            <FadeInBox width="full" isVisible={joinQuery.isConfirmed || joinQuery.isPending || joinQuery.isFailed}>
                <SubTransactionSubmittedContent query={joinQuery} />
            </FadeInBox>
        </VStack>
    );
}
