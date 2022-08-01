import { usePool } from '~/modules/pool/lib/usePool';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { orderBy, sortBy, sumBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useQuery } from 'react-query';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolGetMaxProportionalInvestmentAmount() {
    const { priceForAmount } = useGetTokens();
    const { poolService, pool } = usePool();
    const { userAddress } = useUserAccount();
    const { getUserBalanceForToken } = usePoolUserTokenBalancesInWallet();
    const tokenOptionsWithHighestValue: TokenAmountHumanReadable[] = pool.investConfig.options.map((option) => {
        const tokenWithHighestValue = orderBy(
            option.tokenOptions,
            (tokenOption) => priceForAmount({ ...tokenOption, amount: getUserBalanceForToken(tokenOption.address) }),
            'desc',
        )[0].address;

        return { address: tokenWithHighestValue, amount: getUserBalanceForToken(tokenWithHighestValue) };
    });

    const tokenWithSmallestValue = sortBy(
        tokenOptionsWithHighestValue.map((balance) => {
            const token = pool.tokens.find((token) => token.address === replaceEthWithWeth(balance.address));

            return {
                ...balance,
                //this has precision errors, but its only used for sorting, not any operations
                normalizedAmount: token?.weight
                    ? (parseFloat(balance.amount) / parseFloat(token.balance)) * (1 / parseFloat(token.weight))
                    : parseFloat(balance.amount),
            };
        }),
        'normalizedAmount',
    )[0];

    return useQuery(
        [
            {
                key: 'poolGetMaxProportionalInvestmentAmount',
                tokenOptionsWithHighestValue,
                tokenWithSmallestValue,
                userAddress,
            },
        ],
        async ({ queryKey }) => {
            const hasEth = !!tokenOptionsWithHighestValue.find((token) => isEth(token.address));
            const fixedAmount = {
                ...tokenWithSmallestValue,
                address: replaceEthWithWeth(tokenWithSmallestValue.address),
            };

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(fixedAmount);

            return { maxAmount: sumBy(result, priceForAmount) };
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );
}
