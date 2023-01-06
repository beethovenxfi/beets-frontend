import { useUserData } from '~/lib/user/useUserData';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { Box, HStack } from '@chakra-ui/react';

export function UserWarning() {
    const { usdBalanceForPool } = useUserData();
    const { showToast } = useToast();
    const userHasFundsAtRisk =
        usdBalanceForPool('0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a') > 0 ||
        usdBalanceForPool('0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049') > 0 ||
        usdBalanceForPool('0xa10285f445bcb521f1d623300dc4998b02f11c8f00000000000000000000043b') > 0;

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
                    </HStack>
                ),
            });
        }
    }, [userHasFundsAtRisk]);

    return null;
}
