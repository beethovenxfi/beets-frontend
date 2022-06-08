import { useGetTokens } from '~/lib/global/useToken';
import { useUserBalances } from '~/lib/global/useUserBalances';

export function useTradeUserBalances() {
    const { tokens } = useGetTokens();
    const tokenAddresses = tokens.map((token) => token.address);

    //TODO: add functionality for user imported tokens

    return useUserBalances(tokenAddresses);
}
