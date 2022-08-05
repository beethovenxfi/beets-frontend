import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import WETHAbi from '../abi/WETH.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useWrapEth() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.wethAddress,
            contractInterface: WETHAbi,
            functionName: 'deposit',
        },
        transactionType: 'WRAP',
    });

    function wrap(amount: AmountHumanReadable) {
        submit({
            args: [],
            toastText: `Wrapping ${amount} ${networkConfig.eth.symbol}`,
            overrides: {
                value: parseUnits(amount, 18),
            },
        });
    }

    return {
        wrap,
        ...rest,
    };
}
