import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';

export function useMasterChefHarvestRewards() {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: networkConfig.masterChefContractAddress,
            contractInterface: BeethovenxMasterChefAbi,
        },
        functionName: 'harvest',
        transactionType: 'HARVEST',
    });

    function harvest(farmId: string) {
        submit({
            args: [farmId, accountData?.address],
            toastText: 'Harvest pending rewards',
        });
    }

    return {
        harvest,
        ...rest,
    };
}
