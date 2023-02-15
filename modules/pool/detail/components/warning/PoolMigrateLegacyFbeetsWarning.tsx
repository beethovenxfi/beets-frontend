import { HStack, Text } from '@chakra-ui/react';
import { PoolProvider, usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';
import { TokensProvider } from '~/lib/global/useToken';
import ReliquaryMigrateModal from '~/modules/reliquary/components/ReliquaryMigrateModal';

export function PoolMigrateLegacyFbeetsWarning() {
    const { pool, isFbeetsPool } = usePool();
    const { total } = useLegacyFBeetsBalance();
    const { showToast, removeToast } = useToast();

    useEffect(() => {
        return () => {
            removeToast('migrate-fbeets');
        };
    }, []);

    useEffect(() => {
        if (total > 0 && isFbeetsPool) {
            showToast({
                id: 'migrate-fbeets',
                type: ToastType.Warn,
                content: (
                    <HStack>
                        <Text>You can migrate your legacy fBEETS position to a relic</Text>
                        <TokensProvider>
                            <PoolProvider pool={pool}>
                                <ReliquaryMigrateModal />
                            </PoolProvider>
                        </TokensProvider>
                    </HStack>
                ),
            });
        } else {
            removeToast('migrate-fbeets');
        }
    }, [total]);

    return null;
}
