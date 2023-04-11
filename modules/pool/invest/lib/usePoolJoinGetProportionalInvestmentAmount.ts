import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy, sum, sumBy } from 'lodash';
import { isEth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';

function calculateBptOut(bptTotalSupply: string, amountIn: string, balance: string) {
    return parseFloat(bptTotalSupply) * (parseFloat(amountIn || '') / parseFloat(balance));
}

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const { userAddress } = useUserAccount();
    const { priceForAmount } = useGetTokens();

    // store all the available token addresses in an array for linear pool lookups
    const userInvestTokenBalanceAddresses = userInvestTokenBalances.map((balance) => balance.address);

    const smallestBptOutAmount = sortBy(
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can base the proportions for the other tokens on that
        pool.tokens.map((token) => {
            if (token.__typename === 'GqlPoolTokenPhantomStable') {
                // another loop to find the smallest bptOut amount for the nested stable pool
                const nestedTokens = token.pool.tokens.map((poolToken) => {
                    const address =
                        poolToken.__typename === 'GqlPoolTokenLinear' &&
                        poolToken.pool.tokens.find((nestedPoolToken) =>
                            userInvestTokenBalanceAddresses.includes(nestedPoolToken.address),
                        )?.address;

                    const amount = userInvestTokenBalances.find((balance) => balance.address === address)?.amount || '';

                    return {
                        address,
                        amount,
                        bptOut: calculateBptOut(token.pool.totalShares, amount, poolToken.balance),
                        weight: parseFloat(poolToken.totalBalance) / parseFloat(token.pool.totalShares),
                    };
                });
                const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOut');

                // calculate the proportional amounts and sum them to get the 'amountIn' for the nested stable pool bptOut calculation
                const amount = sum(
                    smallestNestedBptOutAmountArray.map(
                        (nestedToken) =>
                            parseFloat(nestedToken.amount) *
                            (nestedToken.weight / smallestNestedBptOutAmountArray[0].weight),
                    ),
                ).toString();

                const bptOut = calculateBptOut(pool.dynamicData.totalShares, amount, token.balance);

                return {
                    bptOut,
                    token: {
                        address: smallestNestedBptOutAmountArray[0].address,
                        amount: amount.toString(),
                    },
                };
            } else {
                const address =
                    token.__typename === 'GqlPoolTokenLinear'
                        ? token.pool.tokens.find((poolToken) =>
                              userInvestTokenBalanceAddresses.includes(poolToken.address),
                          )?.address
                        : token.address;

                const amount = userInvestTokenBalances.find((balance) => balance.address === address)?.amount || '';

                return {
                    bptOut: calculateBptOut(pool.dynamicData.totalShares, amount, token.balance),
                    token: {
                        address,
                        amount,
                    },
                };
            }
        }),
        'bptOut',
    )[0];

    const tokenWithSmallestBptOutAmount = {
        address: smallestBptOutAmount.token.address || '',
        amount: smallestBptOutAmount.token.amount || '',
    };

    const query = useQuery(
        [
            {
                key: 'joinGetProportionalInvestmentAmount',
                userInvestTokenBalances,
                tokenWithSmallestBptOutAmount,
                userAddress,
            },
        ],
        async ({ queryKey }) => {
            const hasEth = !!userInvestTokenBalances.find((token) => isEth(token.address));
            const fixedAmount = {
                ...tokenWithSmallestBptOutAmount,
                address: replaceEthWithWeth(tokenWithSmallestBptOutAmount.address || ''),
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
