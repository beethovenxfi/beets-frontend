import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';
import { isEth } from '~/lib/services/token/token-util';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService } = usePool();
    const { userInvestTokenBalances } = useInvest();
    const tokenWithLowestValue = sortBy(userInvestTokenBalances, 'valueUSD')[0];

    const query = useQuery(
        [{ key: 'joinGetProportionalInvestmentAmount', tokenWithLowestValue }],
        async ({ queryKey }) => {
            const fixedAmount = {
                ...tokenWithLowestValue,
                address: isEth(tokenWithLowestValue.address) ? networkConfig.wethAddress : tokenWithLowestValue.address,
            };

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(fixedAmount);

            return Object.fromEntries(result.map((item) => [item.address, item.amount]));
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );

    return query;
}
