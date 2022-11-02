import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { useEffect, useState } from 'react';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { Box, Text } from '@chakra-ui/react';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function PoolInvestActions({ onInvestComplete, onClose }: Props) {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();
    const { selectedInvestTokensWithAmounts, totalInvestValue, zapEnabled } = useInvest();
    const { joinPool, ...joinQuery } = useJoinPool(pool, zapEnabled);
    const allInvestTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const {
        hasApprovalForAmount,
        isLoading,
        refetch: refetchUserAllowances,
    } = useUserAllowances(allInvestTokens, networkConfig.balancer.vault);
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const { bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData } = usePoolJoinGetContractCallData(
        bptOutAndPriceImpact?.minBptReceived || null,
        zapEnabled,
    );
    const { refetch: refetchUserTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { refetch: refetchUserBptBalance } = usePoolUserBptBalance();
    const [userSyncBalance, { loading }] = useUserSyncBalanceMutation();

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
                    tooltipText: 'Invest into this pool',
                },
            ];

            setSteps(steps);
        }
    }, [isLoading]);

    return (
        <>
            <FadeInBox width='full' isVisible={joinQuery.isConfirmed || joinQuery.isPending || joinQuery.isFailed}>
                <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
                    Transaction details
                </Text>
                <TransactionSubmittedContent
                    width='full'
                    query={joinQuery}
                    confirmedMessage={`You've successfully invested ${numberFormatUSDValue(totalInvestValue)} into ${
                        pool.name
                    }.`}
                />
            </FadeInBox>
            <Box mt="6">
                <BeetsTransactionStepsSubmit
                    isLoading={steps === null}
                    loadingButtonText="Invest"
                    completeButtonText="Return to pool"
                    onCompleteButtonClick={onClose}
                    steps={steps || []}
                    onSubmit={(id) => {
                        if (id === 'invest' && contractCallData) {
                            joinPool(contractCallData, selectedInvestTokensWithAmounts);
                        }
                    }}
                    onConfirmed={(id) => {
                        if (id !== 'invest') {
                            refetchUserAllowances();
                        } else {
                            refetchUserTokenBalances();
                            refetchUserBptBalance();
                            userSyncBalance({ variables: { poolId: pool.id } });
                            onInvestComplete();
                        }
                    }}
                    queries={[{ ...joinQuery, id: 'invest' }]}
                />
            </Box>
        </>
    );
}
