import BeetsButton from '~/components/button/Button';
import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { ReactNode } from 'react';

export type BeetsSubmitTransactionButtonProps = {
    disabled?: boolean;
    isLoading?: boolean;
    isSubmitting: boolean;
    isPending: boolean;
    onClick: () => void;
    loadingText?: string;
    pendingText?: string;
    submittingText?: string;
    children: ReactNode | ReactNode[];
};

export function BeetsSubmitTransactionButton({
    disabled,
    isLoading,
    isSubmitting,
    isPending,
    onClick,
    loadingText = 'Loading...',
    submittingText = 'Confirm in your wallet...',
    pendingText = 'Waiting for confirmation...',
    ...rest
}: BeetsSubmitTransactionButtonProps & ButtonOptions & ButtonProps) {
    return (
        <BeetsButton
            disabled={disabled || isLoading || isSubmitting || isPending}
            isLoading={isLoading || isSubmitting || isPending}
            loadingText={isSubmitting ? submittingText : isPending ? pendingText : loadingText}
            onClick={onClick}
            {...rest}
        />
    );
}
