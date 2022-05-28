import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';

export function useMasterChefDepositIntoFarm() {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: networkConfig.masterChefContractAddress,
            contractInterface: BeethovenxMasterChefAbi,
        },
        functionName: 'deposit',
        toastType: 'HARVEST',
    });

    function stake(farmId: string, amount: AmountHumanReadable) {
        submit({
            args: [farmId, parseUnits(amount, 18), accountData?.address],
            toastText: 'Stake BPT',
        });
    }

    return {
        stake,
        ...rest,
    };
}
