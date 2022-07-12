import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';

export function usePoolUserTokenBalancesInWallet() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);

    const investTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const investableAmount = sumBy(investTokens, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );

    const canInvestProportionally =
        pool.investConfig.options.filter(
            (option) =>
                option.tokenOptions.filter(
                    (tokenOption) => parseFloat(tokenGetAmountForAddress(tokenOption.address, userBalances)) > 0,
                ).length > 0,
        ).length === pool.investConfig.options.length;

    return {
        ...userBalancesQuery,
        userPoolTokenBalances: userBalances,
        investableAmount,
        canInvestProportionally,
    };
}
