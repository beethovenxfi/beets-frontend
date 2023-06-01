import { Box, HStack, Link } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { ReactNode, useEffect } from 'react';

interface Props {
    pools: string[];
    content: ReactNode;
}

export function PoolWarningThirdParty({ pools, content }: Props) {
    const { showToast } = useToast();
    const { pool } = usePool();

    useEffect(() => {
        if (pools.includes(pool.id)) {
            showToast({
                id: 'pool-detail-alert',
                type: ToastType.Info,
                content,
            });
        }
    }, []);

    return null;
}
