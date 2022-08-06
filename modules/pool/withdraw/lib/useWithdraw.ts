import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { isEth, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { sumBy, every } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';

export function useWithdraw() {
    const { pool } = usePool();
    const { selectedOptions } = useWithdrawState();
    const { getUserBalanceForToken, userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { priceForAmount } = useGetTokens();

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
