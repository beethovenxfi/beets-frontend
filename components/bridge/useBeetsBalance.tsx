import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { keyBy } from 'lodash';
import { parseUnits } from 'ethers/lib/utils.js';

export function useBeetsBalance() {
    const networkConfig = useNetworkConfig();
    const {
        userBalances: balances = [],
        isLoading: isLoadingBalances,
        refetch,
    } = useUserBalances([networkConfig.beets.address]);

    const userBalancesMap = keyBy(balances, 'address');
    const beetsBalance = userBalancesMap[networkConfig.beets.address]?.amount || '0';

    return {
        balance: beetsBalance,
        isLoading: isLoadingBalances,
        hasBalance: parseUnits(beetsBalance, 18).gt(parseUnits('0.000001', 18)), // bridging thru stargate leaves some dust
        refetch,
    };
}
