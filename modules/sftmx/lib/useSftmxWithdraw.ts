import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import FTMStakingAbi from '~/lib/abi/FTMStaking.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useSftmxWithdraw() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.sftmx.ftmStakingProxyAddress,
            contractInterface: FTMStakingAbi,
            functionName: 'withdraw',
        },
        transactionType: 'EXIT',
    });

    function withdraw(amount: AmountHumanReadable, wrId: string) {
        submit({
            args: [wrId, 0],
            toastText: `Withdraw ${amount} sFTMx`,
        });
    }

    return {
        withdraw,
        ...rest,
    };
}
