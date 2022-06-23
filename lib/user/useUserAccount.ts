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
        userAddressVar(query.data?.address);
    }, [query.data?.address]);

    return {
        ...query,
        isLoading: query.isLoading || isFirstRender,
        userAddress: query.data?.address,
        isConnected: !!query.data?.address && !isFirstRender,
    };
}
