import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import WETHAbi from '../abi/WETH.json';
import { networkConfig } from '~/lib/config/network-config';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';

export function useUnwrapEth() {
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
