import { useUserAccount } from '~/lib/user/useUserAccount';
import { useGetAppGlobalPollingDataQuery, useGetUserDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

export function GlobalRenderer() {
    const currentUserAddress = useRef('');
    const { isConnected, userAddress } = useUserAccount();
    const { startPolling: startPollingAppData } = useGetAppGlobalPollingDataQuery({ fetchPolicy: 'network-only' });
    const { startPolling: startPollingUserData, refetch: refetchUserData } = useGetUserDataQuery({
        fetchPolicy: 'network-only',
    });

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

    return <Box>{null}</Box>;
}
