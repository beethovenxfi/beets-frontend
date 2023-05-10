import { PoolOvernightWarning } from '~/modules/pool/detail/components/warning/PoolOvernightWarning';
import { PoolMigrateLegacyFbeetsWarning } from '~/modules/pool/detail/components/warning/PoolMigrateLegacyFbeetsWarning';
import { PoolDetailWarning } from '~/modules/pool/detail/components/warning/PoolDetailWarning';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/warning/PoolStakeInFarmWarning';
import { PoolFbeetsWarning } from '~/modules/pool/detail/components/warning/PoolFbeetsWarning';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolWarnings() {
    const { pool, isFbeetsPool } = usePool();
    const { hasBpt } = usePoolUserBptBalance();
    const { total } = useLegacyFBeetsBalance();
    const { warnings } = useNetworkConfig();

    return (
        <>
            <PoolOvernightWarning />
            <PoolMigrateLegacyFbeetsWarning />
            {warnings.poolDetail[pool.id] && <PoolDetailWarning warning={warnings.poolDetail[pool.id]} />}
            {pool.staking && !isFbeetsPool && <PoolStakeInFarmWarning />}
            {isFbeetsPool && hasBpt && total === 0 && <PoolFbeetsWarning />}
        </>
    );
}
