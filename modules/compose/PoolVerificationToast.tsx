import { Text } from '@chakra-ui/react';
import { useVerifyContract } from '~/lib/global/useVerifyContract';
import { useGetContructorArgs } from '~/lib/global/useGetConstructorArgs';
import { useEffect } from 'react';

interface Props {
    poolAddress: string;
    updateIsVerifying: (newValue: boolean) => void;
}

export function PoolVerification({ poolAddress, updateIsVerifying }: Props) {
    const { data: constructorArguements } = useGetContructorArgs(poolAddress);
    const { data, isLoading } = useVerifyContract(poolAddress, constructorArguements || '');

    useEffect(() => {
        if (!data && isLoading) {
            updateIsVerifying(true);
        } else if (data && !isLoading) {
            updateIsVerifying(false);
        }
    }, [data, isLoading]);

    return <Text>{isLoading ? 'Verifying...' : 'Verified!'}</Text>;
}
