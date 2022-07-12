import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';

export function useMasterChefHarvestAllRewards() {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: networkConfig.masterChefContractAddress,
            contractInterface: BeethovenxMasterChefAbi,
        },
        functionName: 'harvestAll',
        toastType: 'HARVEST',
    });

    function harvestAll(farmIds: string[]) {
        submit({
            args: [farmIds, accountData?.address],
            toastText: 'Harvest all pending rewards',
        });
    }

    return {
        harvestAll,
        ...rest,
    };
}
