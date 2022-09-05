import { useUserAccount } from '~/lib/user/useUserAccount';
import { sortBy, sumBy } from 'lodash';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';
import { useQuery } from 'react-query';
import { useGetTokens } from '~/lib/global/useToken';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePool } from '~/modules/pool/lib/usePool';

export function usePoolGetMaxProportionalInvestmentAmount() {
    const { priceForAmount } = useGetTokens();
    const { poolService, pool } = usePool();
    const { userAddress } = useUserAccount();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();

    const tokenWithSmallestValue = sortBy(
        userInvestTokenBalances.map((balance) => {
            const investOption = pool.investConfig.options.find((option) => {
                const tokenOption = option.tokenOptions.find(
                    (tokenOption) => tokenOption.address === replaceEthWithWeth(balance.address),
                );

                return !!tokenOption;
            });

            const poolToken = investOption ? pool.tokens[investOption.poolTokenIndex] : undefined;
            //TODO: this is not exactly accurate as we assume here the invest token has a 1:priceRate ratio to the pool token, which is not the case
            //TODO: as the invest token is often time nested deeper in linear pool of phantom stable
            const scaledBalance = parseFloat(balance.amount) / parseFloat(poolToken?.priceRate || '1');

            return {
                ...balance,
                //this has precision errors, but its only used for sorting, not any operations
                normalizedAmount: poolToken?.weight
                    ? (scaledBalance / parseFloat(poolToken.balance)) * (1 / parseFloat(poolToken.weight))
                    : scaledBalance,
            };
        }),
        'normalizedAmount',
    )[0];

    const query = useQuery(
        [
            {
                key: 'poolGetMaxProportionalInvestmentAmount',
                tokenWithSmallestValue,
                userAddress,
            },
        ],
        async ({ queryKey }) => {
            const fixedAmount = {
                ...tokenWithSmallestValue,
                address: replaceEthWithWeth(tokenWithSmallestValue.address),
            };

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(
                fixedAmount,
                selectedInvestTokens.map((token) => token.address),
            );

            return { maxAmount: sumBy(result, priceForAmount) };
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );

    return { ...query };
}
