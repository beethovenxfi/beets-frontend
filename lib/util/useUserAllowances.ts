import { useAllowances } from '~/lib/util/useAllowances';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useUserAllowances(tokens: (TokenBase | null)[], contractAddress?: string) {
    const { userAddress } = useUserAccount();

    return useAllowances(userAddress || null, tokens, contractAddress);
}
