import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { keyBy } from 'lodash';

export function useOldBeetsBalance() {
    const networkConfig = useNetworkConfig();
    const { userBalances: balances = [], isLoading: isLoadingBalances } = useUserBalances([
        networkConfig.beets.oldAddress,
    ]);

    const userBalancesMap = keyBy(balances, 'address');
    const oldBeetsBalance = userBalancesMap[networkConfig.beets.oldAddress]?.amount || '0';

    return {
        balance: oldBeetsBalance,
        isLoading: isLoadingBalances,
    };
}
