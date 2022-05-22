import { useGetTokens } from '~/lib/global/useToken';
import { tokenService } from '~/lib/services/token/token.service';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { AmountHumanReadable, TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { useBoolean } from '@chakra-ui/hooks';
import { useBalances } from '~/lib/util/useBalances';

export function useUserBalances(addresses: string[], additionalTokens?: TokenBase[]) {
    const { tokens: whitelistedTokens } = useGetTokens();
    const { data: accountData } = useAccount();
    const tokens = [...whitelistedTokens, ...(additionalTokens || [])].filter((token) =>
        addresses.includes(token.address),
    );
    const { data, isLoading, refetch } = useBalances(accountData?.address || null, tokens);

    function getUserBalance(address: string): AmountHumanReadable {
        return data?.find((balance) => balance.address === address)?.amount || '0';
    }

    useAsyncEffect(async () => {
        loadUserBalances().catch();
    }, [accountData?.address]);

    async function loadUserBalances() {
        if (accountData?.address) {
            refetch().catch();
        }
    }

    return {
        userBalances: data,
        getUserBalance,
        loadUserBalances,
        loadingUserBalances: isLoading,
    };
}
