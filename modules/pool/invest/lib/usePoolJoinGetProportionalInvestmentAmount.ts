import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy, sumBy } from 'lodash';
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

    // const userInvestTokenBalancesWithoutPhantomStable: TokenAmountHumanReadable[] = [];
    // const userInvestTokenBalancesPhantomStableOnly: TokenAmountHumanReadable[] = [];

    // const phantomStableIndex = pool.tokens
    //     .filter((token) => token.__typename === 'GqlPoolTokenPhantomStable')
    //     .map((token) => token.index);
    // userInvestTokenBalances.forEach((balance) => {
    //     const options = pool.investConfig.options.filter(
    //         (option) => !phantomStableIndex.includes(option.poolTokenIndex),
    //     );
    //     const hasBalanceToken = options.find((option) =>
    //         option.tokenOptions.find((tokenOption) => tokenOption.address === balance.address),
    //     );
    //     hasBalanceToken
    //         ? userInvestTokenBalancesWithoutPhantomStable.push(balance)
    //         : userInvestTokenBalancesPhantomStableOnly.push(balance);
    // });

    // const totalUserInvestTokenBalancesValueWithoutPhantomStable = sumBy(
    //     userInvestTokenBalancesWithoutPhantomStable,
    //     priceForAmount,
    // );

    // const totalUserInvestTokenBalancesValuePhantomStableOnly = sumBy(
    //     userInvestTokenBalancesPhantomStableOnly,
    //     priceForAmount,
    // );

    // function getSmallestValue(balances: any[], totalUserInvestTokenBalancesValue: any) {
    //     return balances.map((balance) => {
    //         const investOption = pool.investConfig.options.find((option) => {
    //             const tokenOption = option.tokenOptions.find(
    //                 (tokenOption) => tokenOption.address === replaceEthWithWeth(balance.address),
    //             );

    //             return !!tokenOption;
    //         });

    //         const poolToken = investOption ? pool.tokens[investOption.poolTokenIndex] : undefined;
    //         //TODO: this is not exactly accurate as we assume here the invest token has a 1:priceRate ratio to the pool token, which is not the case
    //         //TODO: as the invest token is often time nested deeper in linear pool of phantom stable
    //         const scaledBalance = parseFloat(balance.amount) / parseFloat(poolToken?.priceRate || '1');

    //         const tokenValue = priceForAmount({ address: balance.address, amount: scaledBalance.toString() });
    //         const poolData =
    //             phantomStableIndex.length > 0
    //                 ? pool.tokens.filter((token) => phantomStableIndex.includes(token.index))[0]
    //                 : pool;
    //         const totalLiquidity = 'pool' in poolData ? poolData.pool.totalLiquidity : pool.dynamicData.totalLiquidity;
    //         const stablePhantomAmount =
    //             'pool' in poolData
    //                 ? poolData.pool.tokens
    //                       .filter((token) =>
    //                           'pool' in token
    //                               ? token.pool.tokens.find((nestedToken) => nestedToken.address === balance.address)
    //                               : null,
    //                       )
    //                       .flat()[0]
    //                 : null;

    //         const amount = stablePhantomAmount?.totalBalance ?? poolToken?.balance;
    //         console.log(balance.address, amount, stablePhantomAmount, pool.dynamicData.totalLiquidity, totalLiquidity);
    //         const calculatedWeight =
    //             priceForAmount({ address: balance.address, amount: amount || '' }) / parseFloat(totalLiquidity);
    //         const weightedValue =
    //             (poolToken?.weight && !('pool' in poolData) ? parseFloat(poolToken?.weight || '') : calculatedWeight) *
    //             totalUserInvestTokenBalancesValue;

    //         return {
    //             ...balance,
    //             normalizedAmount: (tokenValue - weightedValue) / weightedValue,
    //             calculatedWeight,
    //         };
    //     });
    // }

    // const phantomStableArray = getSmallestValue(
    //     userInvestTokenBalancesPhantomStableOnly,
    //     totalUserInvestTokenBalancesValuePhantomStableOnly,
    // );

    // console.log({
    //     userInvestTokenBalancesPhantomStableOnly,
    //     totalUserInvestTokenBalancesValuePhantomStableOnly,
    //     phantomStableArray,
    // });

    // const tokenWithSmallestValue = sortBy(
    //     userInvestTokenBalances.map((balance) => {
    //         const investOption = pool.investConfig.options.find((option) => {
    //             const tokenOption = option.tokenOptions.find(
    //                 (tokenOption) => tokenOption.address === replaceEthWithWeth(balance.address),
    //             );

    //             return !!tokenOption;
    //         });

    //         const poolToken = investOption ? pool.tokens[investOption.poolTokenIndex] : undefined;
    //         //TODO: this is not exactly accurate as we assume here the invest token has a 1:priceRate ratio to the pool token, which is not the case
    //         //TODO: as the invest token is often time nested deeper in linear pool of phantom stable
    //         const scaledBalance = parseFloat(balance.amount) / parseFloat(poolToken?.priceRate || '1');

    //         const tokenValue = priceForAmount({ address: balance.address, amount: scaledBalance.toString() });
    //         const calculatedWeight =
    //             priceForAmount({ address: balance.address, amount: poolToken?.balance || '' }) /
    //             parseFloat(pool.dynamicData.totalLiquidity);
    //         const weightedValue =
    //             (poolToken?.weight ? parseFloat(poolToken?.weight || '') : calculatedWeight) *
    //             totalUserInvestTokenBalancesValueWithoutPhantomStable;

    //         return {
    //             ...balance,
    //             normalizedAmount: (tokenValue - weightedValue) / weightedValue,
    //         };
    //     }),
    //     'normalizedAmount',
    // )[0];

    const totalValueArray: any[] = [];
    const smallestValueArray = [];
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
                const weight = parseFloat(token?.totalBalance || '') / parseFloat(totalLiquidity);
                const tokenValue = weight * totalValue;
                console.log(totalValue);
            } else {
                totalValueArray.push({ address: balance.address, amount: balance.amount, weight: poolToken?.weight });
            }
        }
    });

    console.log({ totalValueArray });

    const tokenWithSmallestValue = {
        address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
        amount: '0.801866',
        normalizedAmount: 0.23992669458997087,
    };

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
