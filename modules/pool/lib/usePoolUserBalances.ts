import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';

export function usePoolUserBalances() {
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, ...rest } = useUserBalances(allTokenAddresses, allTokens);
    const userBptBalance = tokenGetAmountForAddress(pool.address, userBalances);
    const userPercentShare = parseFloat(userBptBalance) / parseFloat(pool.dynamicData.totalShares);

    return {
        ...rest,
        userBalances,
        userBptBalance,
        userPercentShare,
    };
}
