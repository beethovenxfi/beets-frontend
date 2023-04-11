import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sumBy } from 'lodash';
import { isEth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { getFixedAmountFromAvailableAmounts } from '~/lib/services/pool/pool-util';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const { userAddress } = useUserAccount();
    const { priceForAmount } = useGetTokens();

    const query = useQuery(
        [
            {
                key: 'joinGetProportionalInvestmentAmount',
                userInvestTokenBalances,
                userAddress,
            },
        ],
        async ({ queryKey }) => {
            const hasEth = !!userInvestTokenBalances.find((token) => isEth(token.address));
            const fixedAmount = getFixedAmountFromAvailableAmounts(
                pool,
                userInvestTokenBalances.map((balance) => ({
                    address: balance.poolTokenAddress,
                    amount: balance.poolTokenAmount,
                })),
            );

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(
                {
                    ...fixedAmount,
                    address: replaceEthWithWeth(fixedAmount.address),
                },
                selectedInvestTokens.map((token) => replaceEthWithWeth(token.address)),
            );

            return {
                tokenProportionalAmounts: Object.fromEntries(
                    result.map((item) => [hasEth ? replaceWethWithEth(item.address) : item.address, item.amount]),
                ),
                totalValueProportionalAmounts: sumBy(result, priceForAmount),
            };
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );

    return {
        ...query,
        tokenProportionalAmounts: query.data?.tokenProportionalAmounts,
        totalValueProportionalAmounts: query.data?.totalValueProportionalAmounts,
    };
}
