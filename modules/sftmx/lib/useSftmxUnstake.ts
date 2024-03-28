import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import FTMStakingAbi from '~/lib/abi/FTMStaking.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils.js';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { BigNumber } from 'ethers';

export function useSftmxUnstake() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.sftmx.ftmStakingProxyAddress,
            contractInterface: FTMStakingAbi,
            functionName: 'undelegate',
        },
        transactionType: 'UNSTAKE',
    });

    const wrID = `${Date.now()}`;

    function undelegate(amount: AmountHumanReadable, penalty: BigNumber) {
        submit({
            args: [wrID, parseUnits(amount, 18), penalty],
            toastText: `Unstake ${amount} FTM`,
        });
    }

    return {
        undelegate,
        ...rest,
    };
}
