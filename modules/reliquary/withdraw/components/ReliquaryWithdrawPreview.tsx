import { Box, HStack, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useReliquaryWithdrawState } from '~/modules/reliquary/withdraw/lib/useReliquaryWithdrawState';
import { ReliquaryWithdrawSummary } from '~/modules/reliquary/withdraw/components/ReliquaryWithdrawSummary';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { CardRow } from '~/components/card/CardRow';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { sum } from 'lodash';
import { usePool } from '~/modules/pool/lib/usePool';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { useReliquaryWithdrawAndHarvestContractCallData } from '~/modules/reliquary/lib/useReliquaryWithdrawAndHarvestContractCallData';
import { useReliquaryZap } from '~/modules/reliquary/lib/useReliquaryZap';
import { oldBnumToHumanReadable, oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { useEffect, useState } from 'react';
import { useBatchRelayerHasApprovedForAll } from '../../lib/useBatchRelayerHasApprovedForAll';

interface Props {
    onWithdrawComplete(): void;
    onClose(): void;
}

export function ReliquaryWithdrawPreview({ onWithdrawComplete, onClose }: Props) {
    const { pool } = usePool();
    const { getToken } = useGetTokens();
    const { selectedWithdrawType, singleAssetWithdraw, proportionalAmounts, proportionalPercent } =
        useReliquaryWithdrawState();
    const { priceForAmount } = useGetTokens();
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);

    const { selectedRelic, refetchRelicPositions } = useReliquary();
    const { data: reliquaryContractCalls, isLoading: isLoadingReliquaryContractCallData } =
        useReliquaryWithdrawAndHarvestContractCallData({
            relicId: parseInt(selectedRelic?.relicId || ''),
            bptAmount: oldBnumToHumanReadable(
                oldBnumScaleAmount(selectedRelic?.amount || '').times(proportionalPercent / 100),
            ),
            poolTotalShares: pool.dynamicData.totalShares,
            poolTokens: pool.tokens,
        });
    const { data: batchRelayerHasApprovedForAll, isLoading: isLoadingBatchRelayerHasApprovedForAll } =
        useBatchRelayerHasApprovedForAll();
    const { reliquaryZap, ...reliquaryZapQuery } = useReliquaryZap('WITHDRAW');

    const withdrawAmounts =
        selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw
            ? [singleAssetWithdraw]
            : proportionalAmounts
            ? proportionalAmounts
            : [];

    const totalWithdrawValue = sum(withdrawAmounts.map(priceForAmount));

    const isLoading = isLoadingReliquaryContractCallData || isLoadingBatchRelayerHasApprovedForAll;

    useEffect(() => {
        if (!isLoading) {
            let investStep: TransactionStep = { id: 'exit', tooltipText: '', type: 'other', buttonText: 'Withdraw' };

            const steps: TransactionStep[] = [investStep];

            if (!batchRelayerHasApprovedForAll) {
                steps.unshift({
                    id: 'batch-relayer-reliquary',
                    type: 'other',
                    buttonText: 'Approve Batch Relayer for all relics',
                    tooltipText: 'This relic requires you to approve the batch relayer.',
                });
            }

            setSteps(steps);
        }
    }, [isLoading]);

    return (
        <Box>
            <BeetsBox mt="4" p="2">
                {withdrawAmounts.map((token, index) => {
                    return (
                        <CardRow key={token.address} mb={withdrawAmounts.length - 1 === index ? '0' : '1'}>
                            <HStack spacing="1.5" flex="1">
                                <TokenAvatar size="xs" address={token.address} />
                                <Text>{getToken(token.address)?.symbol}</Text>
                            </HStack>
                            <Box>
                                <Box textAlign="right">{tokenFormatAmount(token.amount)}</Box>
                                <Box textAlign="right" fontSize="sm" color="gray.200">
                                    {numberFormatUSDValue(priceForAmount(token))}
                                </Box>
                            </Box>
                        </CardRow>
                    );
                })}
            </BeetsBox>
            <ReliquaryWithdrawSummary mt="6" mb="8" />
            <FadeInBox
                isVisible={reliquaryZapQuery.isConfirmed || reliquaryZapQuery.isPending || reliquaryZapQuery.isFailed}
            >
                <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
                    Transaction details
                </Text>
                <TransactionSubmittedContent
                    width="full"
                    query={reliquaryZapQuery}
                    confirmedMessage={`You've successfully withdrawn ${numberFormatUSDValue(
                        totalWithdrawValue,
                    )} from Reliquary.`}
                    mb="6"
                />
            </FadeInBox>

            <BeetsTransactionStepsSubmit
                isLoading={isLoadingReliquaryContractCallData}
                loadingButtonText=""
                completeButtonText="Return to maBEETS"
                onCompleteButtonClick={onClose}
                onSubmit={() => {
                    if (reliquaryContractCalls) {
                        reliquaryZap(reliquaryContractCalls);
                    }
                }}
                onConfirmed={async (id) => {
                    if (id === 'exit') {
                        onWithdrawComplete();
                        refetchRelicPositions();
                    }
                }}
                steps={steps || []}
                queries={[{ ...reliquaryZapQuery, id: 'exit' }]}
            />
        </Box>
    );
}
