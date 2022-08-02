import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { useEffect, useState } from 'react';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';

interface Props {
    onInvestComplete(): void;
}

export function PoolInvestActions({ onInvestComplete }: Props) {
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
