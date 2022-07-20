import { Box, HStack, Text } from '@chakra-ui/react';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
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

    const withdrawAmounts =
        selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw ? [singleAssetWithdraw] : data ? data : [];

    return (
        <Box>
            <BeetsBox mt="4" pt="0.5">
                {withdrawAmounts.map((token, index) => {
                    return (
                        <BeetsBoxLineItem
                            key={token.address}
                            last={index === withdrawAmounts.length - 1}
                            pl="3"
                            center={true}
                            leftContent={
                                <HStack spacing="1.5" flex="1">
                                    <TokenAvatar size="xs" address={token.address} />
                                    <Text>{getToken(token.address)?.symbol}</Text>
                                </HStack>
                            }
                            rightContent={
                                <Box>
                                    <Box textAlign="right">{tokenFormatAmount(token.amount)}</Box>
                                    <Box textAlign="right" fontSize="sm" color="gray.200">
                                        {numberFormatUSDValue(priceForAmount(token))}
                                    </Box>
                                </Box>
                            }
                        />
                    );
                })}
            </BeetsBox>
            <PoolWithdrawSummary mt="6" mb="8" />

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
