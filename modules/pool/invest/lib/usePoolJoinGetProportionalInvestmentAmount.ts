import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy, sumBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
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

            const tokenValue = priceForAmount({ address: balance.address, amount: scaledBalance.toString() });
            const calculatedWeight =
                priceForAmount({ address: balance.address, amount: poolToken?.balance || '' }) /
                parseFloat(pool.dynamicData.totalLiquidity);
            const weightedValue =
                (poolToken?.weight ? parseFloat(poolToken.weight) : calculatedWeight) *
                totalUserInvestTokenBalancesValue;

            return {
                ...balance,
                normalizedAmount: (tokenValue - weightedValue) / weightedValue,
            };
        }),
        'normalizedAmount',
    )[0];

    const query = useQuery(
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

            return {
                tokenProportionalAmounts: Object.fromEntries(
                    result.map((item) => [hasEth ? replaceWethWithEth(item.address) : item.address, item.amount]),
                ),
                // this is still not ideal for when there are multiple invest options for a token
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
