import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import { usePoolUserStakedBalance } from '~/modules/pool/lib/usePoolUserStakedBalance';
import { parseUnits } from 'ethers/lib/utils';
import { formatFixed } from '@ethersproject/bignumber';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserBptWalletBalance } from '~/modules/pool/lib/usePoolUserBptWalletBalance';

export function usePoolUserPoolTokenBalances() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);
    const { data: userStakedBptBalance, ...userStakedBalanceQuery } = usePoolUserStakedBalance();
    const { userWalletBptBalance } = usePoolUserBptWalletBalance(userBalances);

    const userStakedBptBalanceScaled = parseUnits(userStakedBptBalance || '0', 18);
    const userBptBalanceScaled = userWalletBptBalance.add(userStakedBptBalanceScaled);

    const investTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const investableAmount = sumBy(investTokens, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );

    return {
        ...userBalances,
        isLoading: userBalancesQuery.isLoading || userStakedBalanceQuery.isLoading,
        isError: userBalancesQuery.isError || userStakedBalanceQuery.isError,
        error: userBalancesQuery.error || userStakedBalanceQuery.error,
        userPoolTokenBalances: userBalances,

        userTotalBptBalance: formatFixed(userWalletBptBalance.add(userStakedBptBalanceScaled), 18),
        userWalletBptBalance: formatFixed(userWalletBptBalance, 18),
        userStakedBptBalance: formatFixed(userStakedBptBalanceScaled, 18),
        hasBpt: userBptBalanceScaled.gt(0),
        hasBptInWallet: userWalletBptBalance.gt(0),
        hasBptStaked: userStakedBptBalanceScaled.gt(0),
        investableAmount,
    };
}
