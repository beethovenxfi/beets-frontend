import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sumBy } from 'lodash';
import { isEth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService } = usePool();
    const { userInvestTokenBalances } = useInvest();
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

            if (!poolService.joinGetMaxProportionalForUserBalances) {
                return {};
            }

            const result = await poolService.joinGetMaxProportionalForUserBalances(userInvestTokenBalances);

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
