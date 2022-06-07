import { useAccount } from 'wagmi';
import { useAllowances } from '~/lib/util/useAllowances';
import { TokenBase } from '~/lib/services/token/token-types';

export function useUserAllowances(tokens: TokenBase[], contractAddress?: string) {
    const { data: accountData } = useAccount();

    return useAllowances(accountData?.address || null, tokens, contractAddress);
}
