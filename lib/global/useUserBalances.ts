import { useGetTokens } from '~/lib/global/useToken';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { useBalances } from '~/lib/util/useBalances';

export function useUserBalances(addresses: string[], additionalTokens?: TokenBase[]) {
    const { tokens: whitelistedTokens } = useGetTokens();
    const { data: accountData } = useAccount();
    const tokens = [...whitelistedTokens, ...(additionalTokens || [])].filter((token) =>
        addresses.includes(token.address),
    );
    const { data, isLoading, refetch, isError, error, isRefetching } = useBalances(
        accountData?.address || null,
        tokens,
    );

    function getUserBalance(address: string): AmountHumanReadable {
        return data?.find((balance) => balance.address === address)?.amount || '0';
    }

    useEffect(() => {
        if (accountData?.address) {
            refetch().catch();
        }
    }, [accountData?.address]);

    return {
        userBalances: data,
        getUserBalance,
        refetch,
        isLoading,
        isError,
        error,
        isRefetching,
    };
}
