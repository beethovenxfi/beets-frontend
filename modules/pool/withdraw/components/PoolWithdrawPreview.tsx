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
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsTransactionStepsSubmit } from '~/components/button/BeetsTransactionStepsSubmit';
import { CardRow } from '~/components/card/CardRow';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { sum } from 'lodash';
import { InfoButton } from '~/components/info-button/InfoButton';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';

interface Props {
    onWithdrawComplete(): void;
}

export function PoolWithdrawPreview({ onWithdrawComplete }: Props) {
    const { pool } = usePool();
    const { getToken } = useGetTokens();
    const { selectedWithdrawType, singleAssetWithdraw } = useWithdrawState();
    const { data } = usePoolExitGetProportionalWithdrawEstimate();
    const { priceForAmount } = useGetTokens();
    const { exitPool, ...exitPoolQuery } = useExitPool(pool);
    const { data: contractCallData } = usePoolExitGetContractCallData();
    const totalValue = sum((data || []).map(priceForAmount));

    const withdrawAmounts =
        selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw ? [singleAssetWithdraw] : data ? data : [];

    return (
        <Box>
            <BeetsBox mt="4" p="2">
                {withdrawAmounts.map((token, index) => {
                    return (
                        <CardRow key={token.address}>
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
                <CardRow mb="0">
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            moreInfoUrl="https://docs.beets.fi"
                            infoText="The maximum amount of slippage that you're willing to accept for the transaction."
                        />
                    </Box>
                    <SlippageTextLinkMenu />
                </CardRow>
            </BeetsBox>
            <PoolWithdrawSummary mt="6" mb="8" />
            <FadeInBox isVisible={exitPoolQuery.isConfirmed || exitPoolQuery.isPending || exitPoolQuery.isFailed}>
                <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
                    Transaction details
                </Text>
                <TransactionSubmittedContent
                    query={exitPoolQuery}
                    confirmedMessage={`You've successfully withdrawn ${numberFormatUSDValue(totalValue)} from ${
                        pool.name
                    }.`}
                />
            </FadeInBox>

            <BeetsTransactionStepsSubmit
                isLoading={false}
                loadingButtonText=""
                completeButtonText="Return to pool"
                onCompleteButtonClick={() => {
                    onWithdrawComplete();
                }}
                onSubmit={() => {
                    if (contractCallData) {
                        exitPool(contractCallData);
                    }
                }}
                onConfirmed={async (id) => {}}
                steps={[{ id: 'exit', tooltipText: '', type: 'other', buttonText: 'Withdraw' }]}
                queries={[{ ...exitPoolQuery, id: 'exit' }]}
            />
        </Box>
    );
}
