import { usePool } from '~/modules/pool/lib/usePool';
import { networkConfig } from '~/lib/config/network-config';
import { useGetFbeetsRatioQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useUserBalances } from '~/lib/global/useUserBalances';
import { parseUnits } from 'ethers/lib/utils';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolUserBptWalletBalance(userBalances: TokenAmountHumanReadable[]) {
    const { pool } = usePool();
    const isFbeetsPool = pool.id === networkConfig.fbeets.poolId;
    const { data: fbeets } = useGetFbeetsRatioQuery();

    const {
        userBalances: additionalUserBalances,
        isLoading,
        isError,
        error,
    } = useUserBalances(isFbeetsPool ? [networkConfig.fbeets.address] : []);

    const userWalletBptBalance = parseUnits(tokenGetAmountForAddress(pool.address, userBalances), 18);

    function getUserFbeetsPoolBptBalance() {
        const fBeetsBalance = tokenGetAmountForAddress(networkConfig.fbeets.address, additionalUserBalances);
        const fbeetsBalanceInBpt = oldBnumScaleAmount(fBeetsBalance)
            .times(fbeets?.ratio || '0')
            .toFixed(0);

        return userWalletBptBalance.add(fbeetsBalanceInBpt);
    }

    return {
        isLoading,
        isError,
        error,
        userWalletBptBalance: isFbeetsPool ? getUserFbeetsPoolBptBalance() : userWalletBptBalance,
    };
}
