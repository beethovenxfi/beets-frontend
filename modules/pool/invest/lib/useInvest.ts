import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';

export function useInvest() {
    const { priceFor } = useGetTokens();
    const { pool } = usePool();
    const { selectedOptions } = useInvestState();
    const { getUserBalanceForToken, userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();

    const userInvestTokenBalances = pool.investConfig.options.map((option) => {
        const selectedToken = selectedOptions[`${option.poolTokenIndex}`] || option.tokenOptions[0].address;
        const userBalance = getUserBalanceForToken(selectedToken);

        return {
            address: selectedToken,
            amount: userBalance,
            valueUSD: priceFor(selectedToken) * parseFloat(userBalance),
        };
    });

    const canInvestProportionally =
        pool.investConfig.options.filter(
            (option) =>
                option.tokenOptions.filter(
                    (tokenOption) =>
                        parseFloat(tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances)) > 0,
                ).length > 0,
        ).length === pool.investConfig.options.length;

    return {
        userInvestTokenBalances,
        canInvestProportionally,
    };
}
