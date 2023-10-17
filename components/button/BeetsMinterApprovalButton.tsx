import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useApproveMinter } from '~/lib/util/useApproveMinter';

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

export function BeetsMinterApprovalButton({ buttonText, ...rest }: Props) {
    const { approve, ...query } = useApproveMinter();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                approve();
            }}
            {...rest}
            borderColor="beets.green"
            _focus={{ boxShadow: 'none' }}
            submittingText="Confirm..."
            pendingText="Waiting..."
        >
            {buttonText ? buttonText : 'Approve Batch Relayer for minting'}
        </BeetsSubmitTransactionButton>
    );
}
