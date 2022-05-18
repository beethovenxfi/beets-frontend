import { useGetTokens } from '~/modules/global/useToken';
import { tokenService } from '~/lib/services/token/token.service';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { AmountHumanReadable, TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { useBoolean } from '@chakra-ui/hooks';

export function useUserBalances(addresses: string[], additionalTokens?: TokenBase[]) {
    const { tokens: whitelistedTokens } = useGetTokens();
    const { data: accountData } = useAccount();
    const tokens = [...whitelistedTokens, ...(additionalTokens || [])].filter((token) =>
        addresses.includes(token.address),
    );
    const [userBalances, setUserBalances] = useState<TokenAmountHumanReadable[]>([]);
    const [loadingUserBalances, { on, off }] = useBoolean(false);

    useAsyncEffect(async () => {
        await loadUserBalances();
    }, [accountData?.address]);

    function getUserBalance(address: string): AmountHumanReadable {
        return userBalances.find((balance) => balance.address === address)?.amount || '0';
    }

    async function loadUserBalances() {
        if (accountData?.address) {
            try {
                on();

                const balances = await tokenService.getBalancesForAccount(accountData.address, tokens);
                setUserBalances(balances);
            } catch {}

            off();
        }
    }

    return {
        userBalances,
        getUserBalance,
        loadUserBalances,
        loadingUserBalances,
    };
}
