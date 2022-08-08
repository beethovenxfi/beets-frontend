import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { isEth, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { sumBy, every } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '~/modules/pool/lib/usePool';

export function useInvest() {
    const { pool } = usePool();
    const { selectedOptions, inputAmounts, zapEnabled } = useInvestState();
    const { getUserBalanceForToken, userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { priceForAmount } = useGetTokens();

    const selectedInvestTokens: GqlPoolToken[] = pool.investConfig.options.map((option) =>
        selectedOptions[`${option.poolTokenIndex}`]
            ? option.tokenOptions.find(
                  (tokenOption) => tokenOption.address === selectedOptions[`${option.poolTokenIndex}`],
              )!
            : option.tokenOptions[0],
    );

    const selectedInvestTokensWithAmounts = selectedInvestTokens.map((token) => ({
        ...token,
        amount: inputAmounts[token.address] || '0',
    }));

    const userInvestTokenBalances: TokenAmountHumanReadable[] = selectedInvestTokens.map((token) => ({
        address: token.address,
        amount: getUserBalanceForToken(token.address),
    }));

    const canInvestProportionally =
        pool.investConfig.options.filter(
            (option) =>
                option.tokenOptions.filter(
                    (tokenOption) =>
                        parseFloat(tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances)) > 0,
                ).length > 0,
        ).length === pool.investConfig.options.length;

    const totalInvestValue = sumBy(selectedInvestTokensWithAmounts, priceForAmount);
    const hasAllZeroTokenAmounts = every(selectedInvestTokensWithAmounts, (token) => parseFloat(token.amount) === 0);
    const isInvestingWithEth = !!selectedInvestTokens.find((token) => isEth(token.address));

    return {
        selectedInvestTokens,
        selectedInvestTokensWithAmounts,
        userInvestTokenBalances,
        canInvestProportionally,
        totalInvestValue,
        hasAllZeroTokenAmounts,
        isInvestingWithEth,
        zapEnabled,
    };
}
