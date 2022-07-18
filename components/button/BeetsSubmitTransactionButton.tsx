import BeetsButton from '~/components/button/Button';
import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { ReactNode, useEffect } from 'react';
import { LinkProps } from '@chakra-ui/react';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';

interface BeetsSubmitTransactionButtonProps extends Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'> {
    loadingText?: string;
    pendingText?: string;
    onClick: () => void;
    submittingText?: string;

    children: ReactNode | ReactNode[];
    onSubmitting?: () => void;
    onPending?: () => void;
    onCanceled?: () => void;
    onConfirmed?: () => void;
}

export function BeetsSubmitTransactionButton({
    isDisabled,
    isLoading,
    isSubmitting,
    isPending,
    onClick,
    loadingText = 'Loading...',
    submittingText = 'Confirm in your wallet...',
    pendingText = 'Waiting for confirmation...',
    onSubmitting,
    onPending,
    onCanceled,
    onConfirmed,
    isSubmitError,
    isConfirmed,
    isFailed,
    reset,
    ...rest
}: BeetsSubmitTransactionButtonProps & ButtonOptions & ButtonProps & LinkProps) {
    useEffect(() => {
        if (isSubmitting && onSubmitting) {
            onSubmitting();
        }
    }, [isSubmitting]);

    useEffect(() => {
        if (isPending && onPending) {
            onPending();
        }
    }, [isPending]);

    useEffect(() => {
        if ((isSubmitError || isFailed) && onCanceled) {
            onCanceled();
        }
    }, [isSubmitError, isFailed]);

    useEffect(() => {
        if (isConfirmed && onConfirmed) {
            onConfirmed();
        }
    }, [isConfirmed]);

    return (
        <BeetsButton
            isDisabled={isDisabled || isLoading || isSubmitting || isPending}
            isLoading={isLoading || isSubmitting || isPending}
            loadingText={isSubmitting ? submittingText : isPending ? pendingText : loadingText}
            onClick={onClick}
            {...rest}
        />
    );
}
