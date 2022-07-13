import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { mapValues, sortBy } from 'lodash';
import { makeVar, useReactiveVar } from '@apollo/client';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';

const DEFAULT_PERCENT = 50;
const proportionalPercentVar = makeVar(DEFAULT_PERCENT);

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService } = usePool();
    const { userInvestTokenBalances } = useInvest();
    const tokenWithLowestValue = sortBy(userInvestTokenBalances, 'valueUSD')[0];

    function setProportionalPercent(value: number) {
        proportionalPercentVar(value);
    }

    const query = useQuery(
        [{ key: 'joinGetProportionalInvestmentAmount', tokenWithLowestValue }],
        async ({ queryKey }) => {
            const fixedAmount = tokenWithLowestValue;

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(fixedAmount);

            return Object.fromEntries(result.map((item) => [item.address, item.amount]));
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );

    const scaledProportionalSuggestions = mapValues(query.data || {}, (val) =>
        oldBnum(val).times(proportionalPercentVar()).div(100).toString(),
    );

    return {
        ...query,
        setProportionalPercent,
        proportionalPercent: useReactiveVar(proportionalPercentVar),
        scaledProportionalSuggestions,
    };
}
