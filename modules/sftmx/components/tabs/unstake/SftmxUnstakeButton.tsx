import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useSftmxUnstake } from '../../../lib/useSftmxUnstake';
import { BigNumber } from 'ethers';
import { useWalletConnectMetadata } from '~/lib/wallet/useWalletConnectMetadata';

interface Props {
    amount: AmountHumanReadable;
    penalty: BigNumber | undefined;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
    inline?: boolean;
    isLoading?: boolean;
}

export function SftmxUnstakeButton({ amount, penalty, ...rest }: Props) {
    const { undelegate, ...query } = useSftmxUnstake();
    const { isSafeAccountViaWalletConnect } = useWalletConnectMetadata();

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                if (penalty) {
                    undelegate(amount, penalty);
                }
            }}
            isDisabled={isSafeAccountViaWalletConnect || !amount || amount === '0' || penalty === undefined}
            {...rest}
        >
            Unstake
        </BeetsSubmitTransactionButton>
    );
}
