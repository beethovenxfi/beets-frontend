import { useUserAccount } from '~/lib/user/useUserAccount';
import { useGetAppGlobalPollingDataQuery, useGetUserDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { useEffect, useRef } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function GlobalRenderer() {
    const currentUserAddress = useRef('');
    const { isConnected, userAddress } = useUserAccount();
    const { startPolling: startPollingAppData } = useGetAppGlobalPollingDataQuery({ fetchPolicy: 'network-only' });
    const { startPolling: startPollingUserData, refetch: refetchUserData } = useGetUserDataQuery({
        fetchPolicy: 'network-only',
    });
    const { showToast } = useToast();
    const networkConfig = useNetworkConfig();

    useEffectOnce(() => {
        startPollingAppData(30_000);
    });

    useEffect(() => {
        if (userAddress) {
            startPollingUserData(30_000);
        }

        if (userAddress && userAddress !== currentUserAddress.current) {
            refetchUserData();
            currentUserAddress.current = userAddress;
        }
    }, [isConnected, userAddress]);

    useEffect(() => {
        if (networkConfig.chainId === '10') {
            showToast({
                id: 'op-upgrade-alert',
                type: ToastType.Warn,
                content: (
                    <HStack>
                        <Box>
                            From June 6th 16:00 UTC until June 6th 20:00 UTC (expected) Optimism will be rolling out its
                            highly anticipated Bedrock upgrade.
                        </Box>
                    </HStack>
                ),
            });
        }
    }, []);

    return <Box>{null}</Box>;
}
