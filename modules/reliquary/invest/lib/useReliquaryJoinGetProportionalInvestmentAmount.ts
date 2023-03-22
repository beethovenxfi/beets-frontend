import { useQuery } from 'react-query';
import { sortBy, sumBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { useReliquaryInvest } from './useReliquaryInvest';

export function useReliquaryJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useReliquaryInvest();
    const { userAddress } = useUserAccount();
    const { priceForAmount } = useGetTokens();

    const totalUserInvestTokenBalancesValue = sumBy(userInvestTokenBalances, priceForAmount);
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
                    ? //? scaledBalance / parseFloat(poolToken.balance) / parseFloat(poolToken.weight)
                      priceForAmount({ address: balance.address, amount: scaledBalance.toString() }) -
                      parseFloat(poolToken.weight) * totalUserInvestTokenBalancesValue
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
