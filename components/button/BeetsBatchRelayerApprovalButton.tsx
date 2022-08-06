import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useApproveBatchRelayer } from '~/lib/util/useApproveBatchRelayer';

interface Props {
    contractToApprove?: string;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
}

export function BeetsBatchRelayerApprovalButton({ ...rest }: Props) {
    const { approve, ...query } = useApproveBatchRelayer();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            isFullWidth
            onClick={() => {
                approve();
            }}
            {...rest}
            variant="outline"
            size="xs"
            color="beets.green"
            borderColor="beets.green"
            _focus={{ boxShadow: 'none' }}
            submittingText="Confirm..."
            pendingText="Waiting..."
        >
            Approve
        </BeetsSubmitTransactionButton>
    );
}
