import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useSftmxWithdraw } from './useSftmxWithdraw';

interface Props {
    amount: AmountHumanReadable;
    wrId: string;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
    inline?: boolean;
    isLoading?: boolean;
}

export function SftmxWithdrawButton({ amount, wrId, ...rest }: Props) {
    const { withdraw, ...query } = useSftmxWithdraw();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                withdraw(amount, wrId);
            }}
            isDisabled={!amount || amount === '0' || rest.isDisabled}
            {...rest}
        >
            Withdraw
        </BeetsSubmitTransactionButton>
    );
}
