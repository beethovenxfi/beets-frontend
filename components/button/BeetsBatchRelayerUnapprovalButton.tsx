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

export function BeetsBatchRelayerUnapprovalButton({ ...rest }: Props) {
    const { unapprove, ...query } = useApproveBatchRelayer();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                unapprove();
            }}
            {...rest}
            borderColor="beets.green"
            _focus={{ boxShadow: 'none' }}
            submittingText="Confirm..."
            pendingText="Waiting..."
        >
            Unapprove Batch Relayer
        </BeetsSubmitTransactionButton>
    );
}
