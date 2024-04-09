import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useSftmxStake } from '../../../lib/useSftmxStake';

interface Props {
    amount: AmountHumanReadable;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
    inline?: boolean;
    isLoading?: boolean;
}

export function SftmxStakeButton({ amount, ...rest }: Props) {
    const { stake, ...query } = useSftmxStake();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                stake(amount);
            }}
            {...rest}
        >
            Stake
        </BeetsSubmitTransactionButton>
    );
}
