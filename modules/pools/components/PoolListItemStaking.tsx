import { networkConfig } from '~/lib/config/network-config';
import { PoolListItemStakingAura } from './thirdparty/PoolListItemStakingAura';
import { PoolListItemStakingFmoney } from './thirdparty/PoolListItemStakingFmoney';

export function PoolListItemStaking({ poolId }: { poolId: string }) {
    const name = networkConfig.thirdPartyStakingPools.find((pool) => pool.poolId === poolId)?.name;

    switch (name) {
        case 'aura':
            return <PoolListItemStakingAura />;
        case 'fmoney':
            return <PoolListItemStakingFmoney />;
        default:
            return null;
    }
}
