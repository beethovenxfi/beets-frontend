import { Box } from '@chakra-ui/react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useBatchRelayerRelicApprove } from '../lib/useBatchRelayerRelicApprove';
import useReliquary from '../lib/useReliquary';

interface Props {
    contractToApprove?: string;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
}

export function ReliquaryBatchRelayerApprovalButton({ ...rest }: Props) {
    const { approve, ...query } = useBatchRelayerRelicApprove();
    const { selectedRelicId } = useReliquary();

    return (
        <Box position="relative">
            <BeetsSubmitTransactionButton
                {...query}
                width="full"
                onClick={() => approve(parseInt(selectedRelicId || ''))}
                {...rest}
                borderColor="beets.green"
                _focus={{ boxShadow: 'none' }}
                submittingText="Confirm..."
                pendingText="Waiting..."
            >
                Approve Batch Relayer
            </BeetsSubmitTransactionButton>
        </Box>
    );
}
