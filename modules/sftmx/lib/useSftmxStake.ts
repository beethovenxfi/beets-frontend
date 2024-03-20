import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import FTMStakingAbi from '~/lib/abi/FTMStaking.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils.js';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useSftmxStake() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.sftmx.ftmStakingProxyAddress,
            contractInterface: FTMStakingAbi,
            functionName: 'deposit',
        },
        transactionType: 'STAKE',
    });

    function stake(amount: AmountHumanReadable) {
        submit({
            args: [],
            overrides: {
                value: parseUnits(amount, 18),
            },
            toastText: `Stake ${amount} FTM`,
        });
    }

    return {
        stake,
        ...rest,
    };
}
