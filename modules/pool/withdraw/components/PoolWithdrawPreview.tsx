import { Box, HStack, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { PoolWithdrawSummary } from '~/modules/pool/withdraw/components/PoolWithdrawSummary';
import { useExitPool } from '~/modules/pool/withdraw/lib/useExitPool';
import { usePoolExitGetContractCallData } from '~/modules/pool/withdraw/lib/usePoolExitGetContractCallData';
import { BeetsTransactionStepsSubmit } from '~/components/button/BeetsTransactionStepsSubmit';
import { CardRow } from '~/components/card/CardRow';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { sum } from 'lodash';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    onWithdrawComplete(): void;
    onClose(): void;
}

export function PoolWithdrawPreview({ onWithdrawComplete, onClose }: Props) {
    const { pool } = usePool();
    const { getToken } = useGetTokens();
    const { selectedWithdrawType, singleAssetWithdraw, proportionalAmounts, proportionalPercent } = useWithdrawState();
    const { priceForAmount } = useGetTokens();
    const { exitPool, ...exitPoolQuery } = useExitPool(pool);
    const { data: contractCallData, isLoading: isLoadingContractCallData } = usePoolExitGetContractCallData();
    const { refetch } = usePoolUserBptBalance();
    const [userSyncBalance, { loading }] = useUserSyncBalanceMutation();

    const withdrawAmounts =
        selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw
            ? [singleAssetWithdraw]
            : proportionalAmounts
            ? proportionalAmounts
            : [];
    const totalWithdrawValue = sum(withdrawAmounts.map(priceForAmount));

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
            <PoolWithdrawSummary mt="6" mb="8" />
            <FadeInBox isVisible={exitPoolQuery.isConfirmed || exitPoolQuery.isPending || exitPoolQuery.isFailed}>
                <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
                    Transaction details
                </Text>
                <TransactionSubmittedContent
                    width="full"
                    query={exitPoolQuery}
                    confirmedMessage={`You've successfully withdrawn ${numberFormatUSDValue(totalWithdrawValue)} from ${
                        pool.name
                    }.`}
                    mb="6"
                />
            </FadeInBox>

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
                    if (id === 'exit') {
                        onWithdrawComplete();
                        refetch();
                        userSyncBalance({ variables: { poolId: pool.id } });
                    }
                }}
                steps={[{ id: 'exit', tooltipText: '', type: 'other', buttonText: 'Withdraw' }]}
                queries={[{ ...exitPoolQuery, id: 'exit' }]}
            />
        </Box>
    );
}
