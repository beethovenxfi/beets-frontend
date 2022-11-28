import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { CardRow } from '~/components/card/CardRow';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBatchRelayerApprovalButton } from '~/components/button/BeetsBatchRelayerApprovalButton';

export function PoolWithdrawSettings({ ...rest }: BoxProps) {
    const { data: hasBatchRelayerApproval, refetch: refetchBatchRelayerApproval } = useHasBatchRelayerApproval();
    const { pool, requiresBatchRelayerOnExit } = usePool();

    const batchRelayerInfoButton = (
        <InfoButton
            label="Batch Relayer"
            infoText="The Batch Relayer is a smart contract that allows multiple individual actions to be grouped together into a single transaction. Zapping requires you to approve the Batch Relayer once."
        />
    );

    return (
        <Box {...rest}>
            <ModalSectionHeadline headline={`Settings`} />
            <BeetsBox p="2">
                {requiresBatchRelayerOnExit && (
                    <CardRow>
                        <Box flex="1">
                            {batchRelayerInfoButton}
                            <Text color="gray.200" fontSize="sm">
                                Withdrawing from this pool requires the batch relayer.
                            </Text>
                        </Box>
                        <Box>
                            {!hasBatchRelayerApproval ? (
                                <BeetsBatchRelayerApprovalButton
                                    onConfirmed={() => {
                                        refetchBatchRelayerApproval();
                                    }}
                                />
                            ) : (
                                <Text color="green">Approved</Text>
                            )}
                        </Box>
                    </CardRow>
                )}
                <CardRow mb="0">
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            infoText="The maximum amount of slippage that you're willing to accept for this transaction."
                        />
                    </Box>
                    <SlippageTextLinkMenu />
                </CardRow>
            </BeetsBox>
        </Box>
    );
}
