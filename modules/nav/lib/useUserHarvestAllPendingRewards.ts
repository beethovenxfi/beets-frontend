import { useMasterChefHarvestAllRewards } from '~/lib/global/useMasterChefHarvestAllRewards';

export function useUserHarvestAllPendingRewards() {
    const { harvestAll: masterChefHarvestAll, ...rest } = useMasterChefHarvestAllRewards();

    function harvestAll(farmIds: string[]) {
        if (farmIds.length === 1 && farmIds[0] === '') return;
        masterChefHarvestAll(farmIds);
    }

    return {
        ...rest,
        harvestAll,
    };
}
