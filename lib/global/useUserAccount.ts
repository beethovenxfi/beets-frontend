import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useBoolean } from '@chakra-ui/hooks';

export function useUserAccount() {
    const query = useAccount();
    const [isFirstRender, setFirstRender] = useBoolean(true);

    useEffect(() => {
        setFirstRender.off();
    }, []);

    return {
        ...query,
        isLoading: query.isLoading || isFirstRender,
        userAddress: query.data?.address,
        isConnected: !!query.data?.address && !isFirstRender,
    };
}
