import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { keyBy } from 'lodash';

export function useBeetsBalance() {
    const networkConfig = useNetworkConfig();
    const {
        userBalances: balances = [],
        isLoading: isLoadingBalances,
        refetch: refetchFbeetsBalance,
    } = useUserBalances([networkConfig.beets.address]);

    const userBalancesMap = keyBy(balances, 'address');
    const beetsBalance = userBalancesMap[networkConfig.beets.address]?.amount || '0';

    return {
        balance: beetsBalance,
        isLoading: isLoadingBalances,
        refetchFbeetsBalance,
    };
}
