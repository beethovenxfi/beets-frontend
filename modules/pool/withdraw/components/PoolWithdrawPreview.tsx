import { Box, HStack, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
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
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { useReliquaryWithdrawAndHarvestContractCallData } from '~/modules/reliquary/lib/useReliquaryWithdrawAndHarvestContractCallData';
import { useReliquaryZap } from '~/modules/reliquary/lib/useReliquaryZap';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { oldBnumToHumanReadable, oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';

interface Props {
    onWithdrawComplete(): void;
    onClose(): void;
}

export function PoolWithdrawPreview({ onWithdrawComplete, onClose }: Props) {
    const { pool } = usePool();
    const { reliquary } = useNetworkConfig();
    const isReliquaryFBeetsPool = pool.id === reliquary.fbeets.poolId;

    const { getToken } = useGetTokens();
    const { selectedWithdrawType, singleAssetWithdraw, proportionalAmounts, proportionalPercent } = useWithdrawState();
    const { priceForAmount } = useGetTokens();
    const { exitPool, ...exitPoolQuery } = useExitPool(pool);
    const { data: contractCallData, isLoading: isLoadingContractCallData } = usePoolExitGetContractCallData();
    const { refetch } = usePoolUserBptBalance();
    const [userSyncBalance, { loading }] = useUserSyncBalanceMutation();

    const { selectedRelic, refetchRelicPositions } = useReliquary();
    const { data: reliquaryContractCalls } = useReliquaryWithdrawAndHarvestContractCallData({
        relicId: parseInt(selectedRelic?.relicId || ''),
        bptAmount: oldBnumToHumanReadable(
            oldBnumScaleAmount(selectedRelic?.amount || '').times(proportionalPercent / 100),
        ),
        poolTotalShares: pool.dynamicData.totalShares,
        poolTokens: pool.tokens,
    });
    const { reliquaryZap, ...reliquaryZapQuery } = useReliquaryZap('WITHDRAW');

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
                completeButtonText={isReliquaryFBeetsPool ? 'Return to maBEETS' : 'Return to pool'}
                onCompleteButtonClick={onClose}
                onSubmit={() => {
                    if (contractCallData && !isReliquaryFBeetsPool) {
                        exitPool(contractCallData, withdrawAmounts);
                    }
                    if (reliquaryContractCalls && isReliquaryFBeetsPool) {
                        reliquaryZap(reliquaryContractCalls);
                    }
                }}
                onConfirmed={async (id) => {
                    if (id === 'exit') {
                        onWithdrawComplete();
                        refetch();
                        userSyncBalance({ variables: { poolId: pool.id } });
                        refetchRelicPositions();
                    }
                }}
                steps={[{ id: 'exit', tooltipText: '', type: 'other', buttonText: 'Withdraw' }]}
                queries={[{ ...(isReliquaryFBeetsPool ? reliquaryZapQuery : exitPoolQuery), id: 'exit' }]}
            />
        </Box>
    );
}
