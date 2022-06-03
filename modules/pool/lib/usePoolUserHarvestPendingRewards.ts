import { useMasterChefHarvestRewards } from '~/lib/global/useMasterChefHarvestRewards';
import { usePool } from '~/modules/pool/lib/usePool';
import { useEffect } from 'react';

export function usePoolUserHarvestPendingRewards() {
    const { pool } = usePool();
    const { harvest: masterChefHarvest, ...rest } = useMasterChefHarvestRewards();

    function harvest() {
        if (pool.staking?.farm) {
            masterChefHarvest(pool.staking?.farm.id);
        }
    }

    return {
        ...rest,
        harvest,
    };
}
