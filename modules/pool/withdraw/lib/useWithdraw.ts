import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';

export function useWithdraw() {
    const { pool } = usePool();
    const { selectedOptions } = useWithdrawState();

    const selectedWithdrawTokens: GqlPoolToken[] = pool.withdrawConfig.options.map((option) =>
        selectedOptions[`${option.poolTokenIndex}`]
            ? option.tokenOptions.find(
                  (tokenOption) => tokenOption.address === selectedOptions[`${option.poolTokenIndex}`],
              )!
            : option.tokenOptions[0],
    );

    const selectedWithdrawTokenAddresses = selectedWithdrawTokens.map((token) => token.address);

    /*const selectedInvestTokensWithAmounts = selectedWithdrawTokens.map((token) => ({
        ...token,
        amount: inputAmounts[token.address] || '0',
    }));*/

    /*const userInvestTokenBalances: TokenAmountHumanReadable[] = selectedInvestTokens.map((token) => ({
        address: token.address,
        amount: getUserBalanceForToken(token.address),
    }));*/

    return {
        selectedWithdrawTokens,
        selectedWithdrawTokenAddresses,
    };
}
