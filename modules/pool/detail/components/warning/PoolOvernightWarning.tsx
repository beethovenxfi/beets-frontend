import { Box, HStack, Link } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';

export function PoolOvernightWarning() {
    const { showToast } = useToast();
    const { pool } = usePool();

    useEffect(() => {
        if (pool.id === '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e') {
            showToast({
                id: 'pool-detail-alert',
                type: ToastType.Info,
                content: (
                    <HStack>
                        <Box>
                            This pool is boosted by Overnight. When investing in this pool, the majority of your assets
                            are wrapped in wUSD+ and wDAI+. Understand how Overnight generates yield prior to investing
                            in this pool. Website:{' '}
                            <Link href="https://overnight.fi" target="_blank">
                                overnight.fi
                            </Link>
                        </Box>
                    </HStack>
                ),
            });
        }
    }, []);

    return null;
}
