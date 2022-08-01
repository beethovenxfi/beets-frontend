import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import WETHAbi from '../abi/WETH.json';
import { networkConfig } from '~/lib/config/network-config';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';

export function useWrapEth() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: networkConfig.wethAddress,
            contractInterface: WETHAbi,
        },
        functionName: 'deposit',
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
