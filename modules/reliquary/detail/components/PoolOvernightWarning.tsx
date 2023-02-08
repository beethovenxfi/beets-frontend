import {
    Alert,
    AlertIcon,
    Box,
    Button,
    HStack,
    Link,
    useBreakpointValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { PoolStakeModal } from '~/modules/pool/stake/PoolStakeModal';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';

export function PoolOvernightWarning() {
    const { showToast, updateToast, removeToast, toastList } = useToast();

    useEffect(() => {
        showToast({
            id: 'pool-detail-alert',
            type: ToastType.Info,
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
        });
    }, []);

    return null;
}
