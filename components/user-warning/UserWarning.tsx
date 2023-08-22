import { useUserData } from '~/lib/user/useUserData';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { Box, HStack, Link } from '@chakra-ui/react';
import { networkConfig } from '~/lib/config/network-config';

export function UserWarning() {
    const { usdBalanceForPool } = useUserData();
    const { showToast } = useToast();

    const poolList = Object.keys(networkConfig.warnings.poolList);
    const userHasFundsAtRisk = poolList.find((pooliD) => usdBalanceForPool(pooliD) > 0);

    useEffect(() => {
        if (userHasFundsAtRisk) {
            showToast({
                id: 'user-funds-alert',
                type: ToastType.Warn,
                content: (
                    <HStack>
                        <Box>
                            You are invested in a pool with a known vulnerability. Please remove liquidity from the
                            affected pool(s) immediately.
                        </Box>
                        <Link href="https://twitter.com/Balancer/status/1694014645378724280" target="_blank">
                            Read more
                        </Link>
                    </HStack>
                ),
            });
        }
    }, [userHasFundsAtRisk]);

    return null;
}
