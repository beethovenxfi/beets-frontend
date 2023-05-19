import { PoolOvernightWarning } from '~/modules/pool/detail/components/warning/PoolOvernightWarning';
import { PoolMigrateLegacyFbeetsWarning } from '~/modules/pool/detail/components/warning/PoolMigrateLegacyFbeetsWarning';
import { PoolDetailWarning } from '~/modules/pool/detail/components/warning/PoolDetailWarning';
import { PoolStakeInFarmWarning } from '~/modules/pool/detail/components/warning/PoolStakeInFarmWarning';
import { PoolFbeetsWarning } from '~/modules/pool/detail/components/warning/PoolFbeetsWarning';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useEffect } from 'react';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { Button, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { PoolGaugeMigrateModal } from '~/modules/pool/stake/PoolMigrateGaugeModal';

export function PoolWarnings() {
    const { pool, isFbeetsPool, isMigratableGauge } = usePool();
    const { isOpen: isMigrateModalVisible, onOpen } = useDisclosure();
    const bptBalances = usePoolUserBptBalance();
    const { total } = useLegacyFBeetsBalance();
    const { warnings } = useNetworkConfig();
    const { showToast } = useToast();

    useEffect(() => {
        showToast({
            id: 'migrate-gauge',
            content: (
                <HStack>
                    <Text>
                        This pool has been updated. To continue earning rewards, please migrate your deposited funds.
                    </Text>
                    <Button bg="orange.300" onClick={onOpen}>
                        Migrate
                    </Button>
                </HStack>
            ),
            type: ToastType.Warn,
        });
    }, [isMigratableGauge]);

    return (
        <>
            <PoolOvernightWarning />
            <PoolMigrateLegacyFbeetsWarning />
            {warnings.poolDetail[pool.id] && <PoolDetailWarning warning={warnings.poolDetail[pool.id]} />}
            {pool.staking && !isFbeetsPool && <PoolStakeInFarmWarning />}
            {isFbeetsPool && bptBalances.hasBpt && total === 0 && <PoolFbeetsWarning />}
            <PoolGaugeMigrateModal noActivator isVisible={isMigrateModalVisible} />
        </>
    );
}
