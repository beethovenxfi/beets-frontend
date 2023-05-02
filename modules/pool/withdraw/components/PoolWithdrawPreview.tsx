import { Box, HStack, Skeleton, StackDivider, Text, VStack } from '@chakra-ui/react';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useExitPool } from '~/modules/pool/withdraw/lib/useExitPool';
import { usePoolExitGetContractCallData } from '~/modules/pool/withdraw/lib/usePoolExitGetContractCallData';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { sum } from 'lodash';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';
import TokenRow from '~/components/token/TokenRow';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '../lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { useEffect, useState } from 'react';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';

interface Props {
    onWithdrawComplete(): void;
    onClose(): void;
}

export function PoolWithdrawPreview({ onWithdrawComplete, onClose }: Props) {
    const { pool, requiresBatchRelayerOnExit } = usePool();
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const { selectedWithdrawType, singleAssetWithdraw, proportionalAmounts, proportionalPercent } = useWithdrawState();
    const { priceForAmount } = useGetTokens();
    const { exitPool, ...exitPoolQuery } = useExitPool(pool);
    const {
        data: contractCallData,
        isLoading: isLoadingContractCallData,
        refetch: refetchContractCallData,
    } = usePoolExitGetContractCallData();
    const { refetch } = usePoolUserBptBalance();
    const [userSyncBalance, { loading }] = useUserSyncBalanceMutation();
    const {
        hasHighPriceImpact,
        formattedPriceImpact,
        isLoading: isLoadingSingleAsset,
        hasMediumPriceImpact,
    } = usePoolExitGetBptInForSingleAssetWithdraw();
    const { data: hasBatchRelayerApproval, isLoading: isLoadingRelayerApproval } = useHasBatchRelayerApproval();

    useEffect(() => {
        const steps: TransactionStep[] = [{ id: 'exit', tooltipText: '', type: 'other', buttonText: 'Withdraw' }];

        if (requiresBatchRelayerOnExit && !hasBatchRelayerApproval) {
            steps.unshift({
                id: 'batch-relayer',
                type: 'other',
                buttonText: 'Approve Batch Relayer',
                tooltipText: 'This pool requires you to approve the batch relayer to withdraw.',
            });
        }

        setSteps(steps);
    }, [isLoadingRelayerApproval]);

    const withdrawAmounts =
        selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw
            ? [singleAssetWithdraw]
            : proportionalAmounts
            ? proportionalAmounts
            : [];
    const totalWithdrawValue = sum(withdrawAmounts.map(priceForAmount));

    return (
        <VStack width="full" spacing="3">
            <VStack spacing="0" width="full">
                <Text fontSize="3rem" fontWeight="semibold">
                    {numberFormatUSDValue(totalWithdrawValue)}
                </Text>
            </VStack>
            <Box width="full" px="4">
                <BeetsBox width="full">
                    <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />} p="2">
                        {withdrawAmounts.map((token) => {
                            return <TokenRow key={token.address} address={token.address} amount={token.amount} />;
                        })}
                    </VStack>
                </BeetsBox>
            </Box>

            <Box width="full" px="4">
                <BeetsTransactionStepsSubmit
                    isLoading={isLoadingContractCallData}
                    loadingButtonText=""
                    completeButtonText="Return to pool"
                    onCompleteButtonClick={onClose}
                    onSubmit={() => {
                        if (contractCallData) {
                            exitPool(contractCallData, withdrawAmounts);
                        }
                    }}
                    onConfirmed={async (id) => {
                        if (id === 'batch-relayer') {
                            refetchContractCallData();
                        } else if (id === 'exit') {
                            onWithdrawComplete();
                            refetch();
                            userSyncBalance({ variables: { poolId: pool.id } });
                        }
                    }}
                    steps={steps}
                    queries={[{ ...exitPoolQuery, id: 'exit' }]}
                />
            </Box>
            <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
                <FadeInBox isVisible={exitPoolQuery.isConfirmed || exitPoolQuery.isPending || exitPoolQuery.isFailed}>
                    <Text textAlign="center" fontSize="lg" fontWeight="semibold">
                        Transaction details
                    </Text>
                    <TransactionSubmittedContent
                        width="full"
                        query={exitPoolQuery}
                        confirmedMessage={`You've successfully withdrawn ${numberFormatUSDValue(
                            totalWithdrawValue,
                        )} from ${pool.name}.`}
                    />
                </FadeInBox>
                <HStack width="full" justifyContent="space-between" fontSize=".85rem">
                    <Text color="gray.100">Price impact</Text>
                    {selectedWithdrawType === 'PROPORTIONAL' ? (
                        <Box>0.00%</Box>
                    ) : isLoadingSingleAsset ? (
                        <Skeleton height="20px" width="64px" mb="4px" />
                    ) : (
                        <Box color={hasMediumPriceImpact ? 'orange' : 'current'}>{formattedPriceImpact}</Box>
                    )}
                </HStack>
            </VStack>
        </VStack>
    );
}
