import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy } from 'lodash';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService } = usePool();
    const { userInvestTokenBalances } = useInvest();
    const tokenWithLowestValue = sortBy(userInvestTokenBalances, 'valueUSD')[0];

    const query = useQuery(
        [{ key: 'joinGetProportionalInvestmentAmount', tokenWithLowestValue }],
        async ({ queryKey }) => {
            const fixedAmount = tokenWithLowestValue;

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            console.log('requery');
            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(fixedAmount);

            return Object.fromEntries(result.map((item) => [item.address, item.amount]));
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );

    return query;
}
