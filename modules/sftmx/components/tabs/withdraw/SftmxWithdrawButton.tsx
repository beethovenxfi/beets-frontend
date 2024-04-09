import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useSftmxWithdraw } from '../../../lib/useSftmxWithdraw';

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
    isWithdrawn: boolean;
}

export function SftmxWithdrawButton({ amount, wrId, isWithdrawn, ...rest }: Props) {
    const { withdraw, ...query } = useSftmxWithdraw();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                withdraw(amount, wrId);
            }}
            {...rest}
        >
            {isWithdrawn ? 'Withdrawn' : 'Withdraw'}
        </BeetsSubmitTransactionButton>
    );
}
