import { PoolWarningThirdParty } from '~/modules/pool/detail/components/warning/PoolWarningThirdParty';
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
import { Box, Button, HStack, Link, Text, useDisclosure } from '@chakra-ui/react';
import { PoolGaugeMigrateModal } from '~/modules/pool/stake/PoolMigrateGaugeModal';

export function PoolWarnings() {
    const { pool, isFbeetsPool } = usePool();
    const { isOpen: isMigrateModalVisible, onOpen } = useDisclosure();
    const bptBalances = usePoolUserBptBalance();
    const { total } = useLegacyFBeetsBalance();
    const { warnings } = useNetworkConfig();
    const { showToast, removeToast } = useToast();
    const showMigrationToast = parseFloat(bptBalances.userLegacyGaugeStakedBptBalance) > 0;

    const overnight = {
        pools: [
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e', // Overnight Pulse
            '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae', // Overnight Pulse Act II
        ],
        content: (
            <HStack>
                <Box>
                    This pool is boosted by Overnight. When investing in this pool, the majority of your assets are
                    wrapped in wUSD+ and wDAI+. Understand how Overnight generates yield prior to investing in this
                    pool. Website:{' '}
                    <Link href="https://overnight.fi" target="_blank">
                        overnight.fi
                    </Link>
                </Box>
            </HStack>
        ),
    };

    const gyro = {
        pools: [
            '0x58910d5bd045a20a37de147f8acea75b2d881f610002000000000000000000d3', // Gyroscope ECLP USDT/USDC
        ],
        content: (
            <HStack>
                <Box>
                    This pool is built by Gyroscope. Their ‘Concentrated Liquidity Pools’ (CLPs) are a class of
                    Automated Market Makers (AMMs) that price the exchange of assets within a defined range. These pools
                    are very new and highly experimental. Read more about them on their website:{' '}
                    <Link href="https://docs.gyro.finance/" target="_blank">
                        Gyroscope Protocol
                    </Link>
                </Box>
            </HStack>
        ),
    };

    useEffect(() => {
        if (showMigrationToast) {
            showToast({
                id: 'migrate-gauge',
                content: (
                    <HStack>
                        <Text>
                            This pool has been updated. To continue earning rewards, please migrate your deposited
                            funds.
                        </Text>
                        <Button bg="orange.300" onClick={onOpen}>
                            Migrate
                        </Button>
                    </HStack>
                ),
                type: ToastType.Warn,
            });
        } else {
            removeToast('migrate-gauge');
        }
    }, [showMigrationToast]);

    return (
        <>
            <PoolWarningThirdParty pools={overnight.pools} content={overnight.content} />
            <PoolWarningThirdParty pools={gyro.pools} content={gyro.content} />
            <PoolMigrateLegacyFbeetsWarning />
            {warnings.poolDetail[pool.id] && <PoolDetailWarning warning={warnings.poolDetail[pool.id]} />}
            {pool.staking && !isFbeetsPool && <PoolStakeInFarmWarning />}
            {isFbeetsPool && bptBalances.hasBpt && total === 0 && <PoolFbeetsWarning />}
            <PoolGaugeMigrateModal noActivator isVisible={isMigrateModalVisible} />
        </>
    );
}
