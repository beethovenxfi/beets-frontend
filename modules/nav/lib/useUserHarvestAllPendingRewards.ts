import { useMasterChefHarvestAllRewards } from '~/lib/global/useMasterChefHarvestAllRewards';

export function useUserHarvestAllPendingRewards() {
    const { harvestAll: masterChefHarvestAll, ...rest } = useMasterChefHarvestAllRewards();

    function harvestAll(farmIds: string[]) {
        if (farmIds === ['']) return;
        masterChefHarvestAll(farmIds);
    }

    return {
        ...rest,
        harvestAll,
    };
}
