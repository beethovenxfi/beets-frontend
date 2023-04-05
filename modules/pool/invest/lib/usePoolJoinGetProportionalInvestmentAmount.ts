import { useQuery } from 'react-query';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { sortBy, sum, sumBy } from 'lodash';
import { isEth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';

function calculateBptOut(bptTotalSupply: string, aI: string, b: string) {
    return parseFloat(bptTotalSupply) * (parseFloat(aI || '') / parseFloat(b));
}

export function usePoolJoinGetProportionalInvestmentAmount() {
    const { poolService, pool } = usePool();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const { userAddress } = useUserAccount();
    const { priceForAmount } = useGetTokens();

    const smallestValue = sortBy(
        pool.tokens.map((token) => {
            const userInvestTokenBalanceAddresses = userInvestTokenBalances.map((balance) => balance.address);

            const bptTotalSupply =
                token.__typename === 'GqlPoolTokenPhantomStable'
                    ? token.pool.totalShares
                    : pool.dynamicData.totalShares;
            const b = token.balance;

            if (token.__typename === 'GqlPoolTokenPhantomStable') {
                const nestedTokens = token.pool.tokens.map((poolToken) => {
                    const tokenAddress =
                        poolToken.__typename === 'GqlPoolTokenLinear' &&
                        poolToken.pool.tokens.find((nestedPoolToken) =>
                            userInvestTokenBalanceAddresses.includes(nestedPoolToken.address),
                        )?.address;
                    const b = poolToken.balance;
                    const aI =
                        userInvestTokenBalances.find((balance) => balance.address === tokenAddress)?.amount || '';
                    const bptOut = calculateBptOut(bptTotalSupply, aI, b);
                    return { address: tokenAddress, amount: aI, bptOut };
                });
                const smallestValueTokenArray = sortBy(nestedTokens, 'bptOut');
                const smallestValueToken = smallestValueTokenArray[0];

                const aI = smallestValueToken.bptOut.toString();
                const bptOut = calculateBptOut(pool.dynamicData.totalShares, aI, b);

                const totalValue =
                    sum(
                        smallestValueTokenArray
                            .slice(1)
                            .map(
                                (nestedToken) =>
                                    (1 / (nestedToken.bptOut / smallestValueToken.bptOut)) *
                                    parseFloat(nestedToken.amount || ''),
                            ),
                    ) + parseFloat(smallestValueToken.amount || '');

                return {
                    bptOut,
                    smallest: {
                        ...smallestValueToken,
                        amount: totalValue.toString(),
                    },
                };
            } else {
                const tokenAddress =
                    token.__typename === 'GqlPoolTokenLinear'
                        ? token.pool.tokens.find((poolToken) =>
                              userInvestTokenBalanceAddresses.includes(poolToken.address),
                          )?.address
                        : token.address;
                const aI = userInvestTokenBalances.find((balance) => balance.address === tokenAddress)?.amount || '';
                const bptOut = calculateBptOut(bptTotalSupply, aI, b);

                return {
                    bptOut,
                    smallest: {
                        address: tokenAddress,
                        amount: aI,
                    },
                };
            }
        }),
        'bptOut',
    )[0];

    const tokenWithSmallestValue = {
        address: smallestValue.smallest.address || '',
        amount: smallestValue.smallest.amount || '',
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
                address: replaceEthWithWeth(tokenWithSmallestValue.address || ''),
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
