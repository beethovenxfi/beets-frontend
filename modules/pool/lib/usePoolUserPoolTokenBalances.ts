import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { usePoolUserStakedBalance } from '~/modules/pool/lib/usePoolUserStakedBalance';
import { parseUnits } from 'ethers/lib/utils';
import { formatFixed } from '@ethersproject/bignumber';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';

export function usePoolUserPoolTokenBalances() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);
    const { data: userStakedBptBalance, ...userStakedBalanceQuery } = usePoolUserStakedBalance();
    const userWalletBptBalanceScaled = parseUnits(tokenGetAmountForAddress(pool.address, userBalances), 18);
    const userStakedBptBalanceScaled = parseUnits(userStakedBptBalance || '0', 18);
    const userBptBalanceScaled = userWalletBptBalanceScaled.add(userStakedBptBalanceScaled);

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

        userTotalBptBalance: formatFixed(userWalletBptBalanceScaled.add(userStakedBptBalanceScaled), 18),
        userWalletBptBalance: formatFixed(userWalletBptBalanceScaled, 18),
        userStakedBptBalance: formatFixed(userStakedBptBalanceScaled, 18),
        hasBpt: userBptBalanceScaled.gt(0),
        hasBptInWallet: userWalletBptBalanceScaled.gt(0),
        hasBptStaked: userStakedBptBalanceScaled.gt(0),
        investableAmount,
    };
}
