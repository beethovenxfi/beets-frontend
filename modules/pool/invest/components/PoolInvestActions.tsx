import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { useEffect, useState } from 'react';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { TradeSubmittedContent } from '~/modules/trade/components/TradeSubmittedContent';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { Box, Text } from '@chakra-ui/react';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

interface Props {
    onInvestComplete(): void;
}

export function PoolInvestActions({ onInvestComplete }: Props) {
    const { pool } = usePool();
    const { selectedInvestTokensWithAmounts, totalInvestValue } = useInvest();
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

    return (
        <>
            <FadeInBox isVisible={joinQuery.isConfirmed || joinQuery.isPending || joinQuery.isFailed}>
                <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
                    Transaction details
                </Text>
                <TransactionSubmittedContent
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
            </Box>
        </>
    );
}
