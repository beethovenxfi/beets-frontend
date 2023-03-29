import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy, sum, sumBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const { userAddress } = useUserAccount();
    const { priceForAmount } = useGetTokens();

    const totalValueArray: any[] = [];
    const smallestValueArray: any[] = [];
    userInvestTokenBalances.forEach((balance) => {
        const investOption = pool.investConfig.options.find((option) => {
            const tokenOption = option.tokenOptions.find(
                (tokenOption) => tokenOption.address === replaceEthWithWeth(balance.address),
            );

            return !!tokenOption;
        });

        const poolToken = investOption ? pool.tokens[investOption.poolTokenIndex] : undefined;

        if (pool.__typename === 'GqlPoolWeighted') {
            if (poolToken?.__typename === 'GqlPoolTokenPhantomStable') {
                const totalLiquidity = poolToken.pool.totalLiquidity;
                const totalValue = sumBy(
                    pool.investConfig.options
                        .map((option, index) =>
                            option.poolTokenIndex === poolToken.index ? userInvestTokenBalances[index] : [],
                        )
                        .flat(),
                    priceForAmount,
                );

                const token = poolToken.pool.tokens
                    .filter((token) =>
                        'pool' in token
                            ? token.pool.tokens.find((nestedToken) => nestedToken.address === balance.address)
                            : null,
                    )
                    .flat()[0];
                const weight =
                    priceForAmount({ address: token.address, amount: token?.totalBalance }) /
                    parseFloat(totalLiquidity);
                const weightedValue = weight * totalValue;
                const tokenValue = priceForAmount(balance);
                smallestValueArray.push({
                    ...balance,
                    poolIndex: poolToken.index,
                    ratioDiff: (tokenValue / weightedValue) * tokenValue,
                    weight,
                });
                totalValueArray.push({ poolIndex: poolToken?.index, amount: weightedValue, weight: poolToken?.weight });
            } else {
                totalValueArray.push({
                    poolIndex: poolToken?.index,
                    address: balance.address,
                    amount: balance.amount,
                    weight: poolToken?.weight,
                });
            }
        }
    });

    const totalValue = sum(
        pool.tokens.map((token) => {
            const values = totalValueArray.filter((item) => item.poolIndex === token.index);
            if (values.length === 1) {
                return priceForAmount({ address: values[0].address, amount: values[0].amount });
            } else {
                return sum(values.map((value) => value.amount));
            }
        }),
    );

    totalValueArray.forEach((item) => {
        if ('address' in item) {
            const tokenValue = priceForAmount({ address: item.address, amount: item.amount });
            const weightedValue = item.weight * totalValue;
            smallestValueArray.push({
                address: item.address,
                amount: item.amount,
                poolIndex: item.poolIndex,
                ratioDiff: (tokenValue / weightedValue) * tokenValue,
            });
        }
    });

    const phantomStableIndices = pool.tokens
        .filter((token) => token.__typename === 'GqlPoolTokenPhantomStable')
        .map((token) => token.index);

    if (phantomStableIndices.length > 0) {
        phantomStableIndices.forEach((idx) => {
            const filteredSmallestValueArray = smallestValueArray.filter((item) => item.poolIndex === idx);
            const psSmallestValue = sortBy(filteredSmallestValueArray, 'ratioDiff')[0];

            const totalValue =
                sum(
                    filteredSmallestValueArray
                        .filter((item) => item.address !== psSmallestValue.address)
                        .map(
                            (item) => parseFloat(item.amount) * (1 / parseFloat(psSmallestValue.weight)) * item.weight,
                        ),
                ) + parseFloat(psSmallestValue.amount);
            const updatedArray = filteredSmallestValueArray.map((item) => ({
                ...item,
                amount: totalValue.toString(),
            }));
            smallestValueArray.forEach((item, index) => {
                const [update] = updatedArray.filter((update) => update.address === item.address);
                if (update) {
                    smallestValueArray[index] = update;
                }
            });
        });
    }

    const tokenWithSmallestValue = sortBy(smallestValueArray, 'ratioDiff')[0];

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
