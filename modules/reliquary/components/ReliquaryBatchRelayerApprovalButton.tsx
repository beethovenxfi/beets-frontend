import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
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
            Approve Batch Relayer for relic {selectedRelicId}
        </BeetsSubmitTransactionButton>
    );
}
