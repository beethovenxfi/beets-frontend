import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { networkConfig } from '~/lib/config/network-config';

interface Props {
    tokenWithAmount: TokenBaseWithAmount;
    contractToApprove?: string;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
}

export function BeetsTokenApprovalButton({
    tokenWithAmount,
    contractToApprove = networkConfig.balancer.vault,
    ...rest
}: Props) {
    const { approve, ...query } = useApproveToken(tokenWithAmount);

    return (
        <BeetsSubmitTransactionButton
            {...query}
            width="full"
            onClick={() => {
                approve(contractToApprove);
            }}
            {...rest}
        >
            Approve {tokenWithAmount.symbol}
        </BeetsSubmitTransactionButton>
    );
}
