import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useBoolean } from '@chakra-ui/hooks';
import { makeVar } from '@apollo/client';

export const userAddressVar = makeVar<string | undefined>(undefined);

export function useUserAccount() {
    const query = useAccount();
    const [isFirstRender, setFirstRender] = useBoolean(true);

    useEffect(() => {
        setFirstRender.off();
    }, []);

    useEffect(() => {
        if (query.address !== userAddressVar()) {
            userAddressVar(query.address);
        }
    }, [query.address]);

    return {
        ...query,
        isLoading: query.isConnecting || isFirstRender,
        isConnecting: query.isConnecting || isFirstRender,
        userAddress: query.address,
        isConnected: !!query.address && !isFirstRender,
    };
}
