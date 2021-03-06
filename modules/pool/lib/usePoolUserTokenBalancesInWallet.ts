import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolUserTokenBalancesInWallet() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);

    const investTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const investableAmount = sumBy(investTokens, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );

    function getUserBalanceForToken(address: string): AmountHumanReadable {
        return userBalances.find((balance) => address === balance.address)?.amount || '0';
    }

    return {
        ...userBalancesQuery,
        userPoolTokenBalances: userBalances,
        investableAmount,
        getUserBalanceForToken,
    };
}
