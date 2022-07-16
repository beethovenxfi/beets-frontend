import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances } = useInvest();
    const { userAddress } = useUserAccount();

    const tokenWithSmallestValue = sortBy(
        userInvestTokenBalances.map((balance) => {
            const token = pool.tokens.find((token) => token.address === replaceEthWithWeth(balance.address));

            return {
                ...balance,
                //this has precision errors, but its only used for sorting, not any operations
                normalizedAmount: token?.weight
                    ? (parseFloat(balance.amount) / parseFloat(token.balance)) * parseFloat(token.weight)
                    : parseFloat(balance.amount),
            };
        }),
        'normalizedAmount',
    )[0];

    return useQuery(
        [{ key: 'joinGetProportionalInvestmentAmount', tokenWithLowestValue: tokenWithSmallestValue, userAddress }],
        async ({ queryKey }) => {
            const hasEth = !!userInvestTokenBalances.find((token) => isEth(token.address));
            const fixedAmount = {
                ...tokenWithSmallestValue,
                address: replaceEthWithWeth(tokenWithSmallestValue.address),
            };

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(fixedAmount);

            return Object.fromEntries(
                result.map((item) => [
                    hasEth && isWeth(item.address) ? replaceWethWithEth(item.address) : item.address,
                    item.amount,
                ]),
            );
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );
}
