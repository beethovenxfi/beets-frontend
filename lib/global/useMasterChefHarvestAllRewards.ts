import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useMasterChefHarvestAllRewards() {
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.masterChefContractAddress,
            contractInterface: BeethovenxMasterChefAbi,
            functionName: 'harvestAll',
        },
        transactionType: 'HARVEST',
    });

    function harvestAll(farmIds: string[]) {
        submit({
            args: [farmIds, userAddress],
            toastText: 'Harvest all pending rewards',
        });
    }

    return {
        harvestAll,
        ...rest,
    };
}
