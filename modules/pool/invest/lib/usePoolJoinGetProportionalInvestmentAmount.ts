import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const { userAddress } = useUserAccount();

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

    return useQuery(
        [
            {
                key: 'joinGetProportionalInvestmentAmount',
                userInvestTokenBalances,
                tokenWithSmallestValue,
                userAddress,
            },
        ],
        async ({ queryKey }) => {
            const hasEth = !!userInvestTokenBalances.find((token) => isEth(token.address));
            const fixedAmount = {
                ...tokenWithSmallestValue,
                address: replaceEthWithWeth(tokenWithSmallestValue.address),
            };

            if (!poolService.joinGetProportionalSuggestionForFixedAmount) {
                return {};
            }

            const result = await poolService.joinGetProportionalSuggestionForFixedAmount(
                fixedAmount,
                selectedInvestTokens.map((token) => replaceEthWithWeth(token.address)),
            );

            return Object.fromEntries(
                result.map((item) => [hasEth ? replaceWethWithEth(item.address) : item.address, item.amount]),
            );
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );
}
