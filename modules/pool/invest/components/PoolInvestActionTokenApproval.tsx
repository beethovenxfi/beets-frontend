import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useEffect } from 'react';

interface Props {
    token: TokenBaseWithAmount;
    onConfirmed(): void;
    onPending(): void;
    onSubmitting(): void;
    onCanceled(): void;
}

export function PoolInvestActionTokenApproval({ token, onConfirmed, onSubmitting, onPending, onCanceled }: Props) {
    const { approve, isPending, isSubmitting, isConfirmed, isSubmitError, isFailed } = useApproveToken(token);

    useEffect(() => {
        if (isConfirmed) {
            onConfirmed();
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (isSubmitting) {
            onSubmitting();
        }
    }, [isSubmitting]);

    useEffect(() => {
        if (isPending) {
            onPending();
        }
    }, [isPending]);

    useEffect(() => {
        if (isSubmitError || isFailed) {
            onCanceled();
        }
    }, [isSubmitError, isFailed]);

    return (
        <BeetsSubmitTransactionButton
            isFullWidth
            isSubmitting={isSubmitting}
            isPending={isPending}
            onClick={() => {
                approve();
            }}
        >
            Approve {token.symbol}
        </BeetsSubmitTransactionButton>
    );
}
