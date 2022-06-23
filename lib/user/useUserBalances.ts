import { useGetTokens } from '~/lib/global/useToken';
import { useEffect } from 'react';
import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { useBalances } from '~/lib/util/useBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useUserBalances(addresses: string[], additionalTokens?: TokenBase[]) {
    const { tokens: whitelistedTokens } = useGetTokens();
    const { userAddress, isLoading: isUserAccountLoading } = useUserAccount();

    const tokens = [...whitelistedTokens, ...(additionalTokens || [])].filter((token) =>
        addresses.includes(token.address),
    );
    const { data, isLoading, refetch, isError, error, isRefetching } = useBalances(userAddress || null, tokens);

    function getUserBalance(address: string): AmountHumanReadable {
        return data?.find((balance) => balance.address === address)?.amount || '0';
    }

    useEffect(() => {
        if (userAddress) {
            refetch().catch();
        }
    }, [userAddress]);

    return {
        userBalances: data,
        getUserBalance,
        refetch,
        isLoading: isLoading || isUserAccountLoading,
        isError,
        error,
        isRefetching,
    };
}
