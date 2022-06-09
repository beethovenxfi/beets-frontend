import { useGetTokens } from '~/lib/global/useToken';
import { useUserBalances } from '~/lib/global/useUserBalances';

export function useUserTokenBalances() {
    const { tokens } = useGetTokens();
    const tokenAddresses = tokens.map((token) => token.address);

    return useUserBalances(tokenAddresses);
}
