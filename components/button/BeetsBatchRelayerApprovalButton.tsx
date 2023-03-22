import { useSigner } from 'wagmi';
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
    buttonText?: string;
}

export function BeetsBatchRelayerApprovalButton({ buttonText, ...rest }: Props) {
    const { approve, signRelayerApproval, ...query } = useApproveBatchRelayer();
    const { data: signer } = useSigner();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                signRelayerApproval(signer);
            }}
            {...rest}
            borderColor="beets.green"
            _focus={{ boxShadow: 'none' }}
            submittingText="Confirm..."
            pendingText="Waiting..."
        >
            {buttonText ? buttonText : 'Approve Batch Relayer'}
        </BeetsSubmitTransactionButton>
    );
}
