import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useMasterChefHarvestAllRewards() {
    const networkConfig = useNetworkConfig();
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
