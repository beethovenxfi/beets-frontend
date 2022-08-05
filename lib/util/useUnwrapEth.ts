import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import WETHAbi from '../abi/WETH.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useUnwrapEth() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.wethAddress,
            contractInterface: WETHAbi,
            functionName: 'withdraw',
        },
        transactionType: 'UNWRAP',
    });

    function unwrap(amount: AmountHumanReadable) {
        submit({
            args: [parseUnits(amount, 18)],
            toastText: `Unwrapping ${amount} w${networkConfig.eth.symbol}`,
        });
    }

    return {
        unwrap,
        ...rest,
    };
}
