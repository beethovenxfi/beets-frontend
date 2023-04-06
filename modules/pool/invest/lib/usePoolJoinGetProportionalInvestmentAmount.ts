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

    const smallestBptOutAmount = sortBy(
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can base the proportions for the other tokens on that
        pool.tokens.map((token) => {
            // store all the available token addresses in an array for linear pool lookups
            const userInvestTokenBalanceAddresses = userInvestTokenBalances.map((balance) => balance.address);
            const balance = token.balance;

            if (token.__typename === 'GqlPoolTokenPhantomStable') {
                // another loop to find the smallest bptOut amount for the nested stable pool
                const nestedTokens = token.pool.tokens.map((poolToken) => {
                    const tokenAddress =
                        poolToken.__typename === 'GqlPoolTokenLinear' &&
                        poolToken.pool.tokens.find((nestedPoolToken) =>
                            userInvestTokenBalanceAddresses.includes(nestedPoolToken.address),
                        )?.address;

                    const amountIn =
                        userInvestTokenBalances.find((balance) => balance.address === tokenAddress)?.amount || '';

                    const bptOut = calculateBptOut(token.pool.totalShares, amountIn, poolToken.balance);
                    const weight = parseFloat(poolToken.totalBalance) / parseFloat(token.pool.totalShares);

                    return { address: tokenAddress, amount: amountIn, bptOut, weight };
                });
                const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOut');
                const smallestNestedBptOutAmount = smallestNestedBptOutAmountArray[0];

                // calculate the proportional amounts and sum them to get the 'amountIn' for the nested stable pool bptOut calculation
                const amountIn = sum(
                    smallestNestedBptOutAmountArray.map(
                        (nestedToken) =>
                            parseFloat(nestedToken.amount) * (nestedToken.weight / smallestNestedBptOutAmount.weight),
                    ),
                ).toString();

                const bptOut = calculateBptOut(pool.dynamicData.totalShares, amountIn, balance);

                return {
                    bptOut,
                    smallest: {
                        ...smallestNestedBptOutAmount,
                        amount: amountIn.toString(),
                    },
                };
            } else {
                const tokenAddress =
                    token.__typename === 'GqlPoolTokenLinear'
                        ? token.pool.tokens.find((poolToken) =>
                              userInvestTokenBalanceAddresses.includes(poolToken.address),
                          )?.address
                        : token.address;

                const amountIn =
                    userInvestTokenBalances.find((balance) => balance.address === tokenAddress)?.amount || '';

                const bptOut = calculateBptOut(pool.dynamicData.totalShares, amountIn, balance);

                return {
                    bptOut,
                    smallest: {
                        address: tokenAddress,
                        amount: amountIn,
                    },
                };
            }
        }),
        'bptOut',
    )[0];

    const tokenWithSmallestBptOutAmount = {
        address: smallestBptOutAmount.smallest.address || '',
        amount: smallestBptOutAmount.smallest.amount || '',
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
