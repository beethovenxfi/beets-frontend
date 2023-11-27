import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useMigrateBeets } from './lib/useMigrateBeets';

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

export function BeetsMigrationButton({ amount, ...rest }: Props) {
    const { migrate, ...query } = useMigrateBeets();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                migrate(amount);
            }}
            {...rest}
        >
            Migrate
        </BeetsSubmitTransactionButton>
    );
}
