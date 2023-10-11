import { AmountHumanReadable, TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { networkConfig } from '~/lib/config/network-config';
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
