import { Spinner, HStack, Text } from '@chakra-ui/react';
import { useGetContructorArgs } from '~/lib/global/useGetConstructorArgs';
import { useEffect } from 'react';
import { useVerifySourceCode } from '~/lib/global/useVerifySourceCode';
import { useCheckVerifyStatus } from '~/lib/global/useCheckVerifyStatus';

interface Props {
    poolAddress: string;
    updateIsVerifying: (newValue: boolean) => void;
}

export function PoolVerification({ poolAddress, updateIsVerifying }: Props) {
    const { data: constructorArguements } = useGetContructorArgs(poolAddress);
    const { data: guid, isLoading: isLoadingVerifySourceCode } = useVerifySourceCode(
        poolAddress,
        constructorArguements || '',
    );
    const {
        data: result,
        isLoading: isLoadingCheckVerifyStatus,
        isRefetching: isRefetchingCheckVerifyStatus,
        refetch,
    } = useCheckVerifyStatus(guid);

    const isLoading = isLoadingVerifySourceCode || isLoadingCheckVerifyStatus || isRefetchingCheckVerifyStatus;

    useEffect(() => {
        if (!result || result?.message === 'NOTOK' || isLoading) {
            updateIsVerifying(true);
            refetch();
        } else {
            updateIsVerifying(false);
        }
    }, [result, isLoading]);

    return (
        <HStack>
            <Text>
                {isLoading || result?.message === 'NOTOK'
                    ? 'Pool is being verified. Please wait.'
                    : 'Pool is verified!'}
            </Text>
            {isLoading && <Spinner size="sm" />}
        </HStack>
    );
}
