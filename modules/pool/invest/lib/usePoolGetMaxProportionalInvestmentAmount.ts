import { useUserAccount } from '~/lib/user/useUserAccount';
import { orderBy, sortBy, sumBy } from 'lodash';
import { isEth, isWeth, replaceEthWithWeth, replaceWethWithEth } from '~/lib/services/token/token-util';
import { useQuery } from 'react-query';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePool } from '~/modules/pool/lib/usePool';

export function usePoolGetMaxProportionalInvestmentAmount() {
    const { priceForAmount } = useGetTokens();
    const { poolService, pool } = usePool();
    const { userAddress } = useUserAccount();
    const { getUserBalanceForToken } = usePoolUserTokenBalancesInWallet();
    const { userInvestTokenBalances, selectedInvestTokens } = useInvest();
    const tokenOptionsWithHighestValue: TokenAmountHumanReadable[] = pool.investConfig.options.map((option) => {
        const tokenWithHighestValue = orderBy(
            option.tokenOptions,
            (tokenOption) => priceForAmount({ ...tokenOption, amount: getUserBalanceForToken(tokenOption.address) }),
            'desc',
        )[0].address;

        return { address: tokenWithHighestValue, amount: getUserBalanceForToken(tokenWithHighestValue) };
    });

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
                key: 'poolGetMaxProportionalInvestmentAmount',
                tokenOptionsWithHighestValue,
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
                selectedInvestTokens.map((token) => replaceEthWithWeth(token.address)),
            );

            return { maxAmount: sumBy(result, priceForAmount) };
        },
        { enabled: true, staleTime: 0, cacheTime: 0 },
    );
}
