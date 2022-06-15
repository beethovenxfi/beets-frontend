import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import { usePoolUserStakedBalance } from '~/modules/pool/lib/usePoolUserStakedBalance';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { formatFixed } from '@ethersproject/bignumber';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserBptWalletBalance } from '~/modules/pool/lib/usePoolUserBptWalletBalance';
// interface Amounts {
//     send: string[];
//     receive: string[];
//     fixedToken: number;
// }
// function getTokenAmountsFromBpt(fixedAmount: string, index: number, type: 'send' | 'receive'): Amounts {
//     if (fixedAmount.trim() === '') return { send: [], receive: [], fixedToken: 0 };

//     const types = ['send', 'receive'];
//     const fixedTokenAddress = this.tokenOf(type, index);
//     const fixedToken = this.allTokens.value[fixedTokenAddress];
//     const fixedDenormAmount = parseUnits(fixedAmount, fixedToken.decimals);
//     const fixedRatio = this.ratioOf(type, index);
//     const amounts = {
//         send: this.sendTokens.map(() => ''),
//         receive: this.receiveTokens.map(() => ''),
//         fixedToken: index,
//     };

//     amounts[type][index] = fixedAmount;

//     [this.sendRatios, this.receiveRatios].forEach((ratios, ratioType) => {
//         ratios.forEach((ratio, i) => {
//             if (i !== index || type !== types[ratioType]) {
//                 const tokenAddress = this.tokenOf(types[ratioType], i);
//                 const token = this.allTokens.value[tokenAddress];
//                 amounts[types[ratioType]][i] = formatUnits(
//                     fixedDenormAmount.mul(ratio).div(fixedRatio),
//                     token.decimals,
//                 );
//             }
//         });
//     });

//     return amounts;
// }

export function usePoolUserPoolTokenBalances() {
    const { priceForAmount } = useGetTokens();
    const { allTokens, allTokenAddresses, pool } = usePool();

    const { userBalances, getUserBalance, ...userBalancesQuery } = useUserBalances(allTokenAddresses, allTokens);
    const { data: userStakedBptBalance, ...userStakedBalanceQuery } = usePoolUserStakedBalance();
    const { userWalletBptBalance } = usePoolUserBptWalletBalance(userBalances);

    const userStakedBptBalanceScaled = parseUnits(userStakedBptBalance || '0', 18);
    const userBptBalanceScaled = userWalletBptBalance.add(userStakedBptBalanceScaled);

    const investTokens = pool.investConfig.options.map((option) => option.tokenOptions).flat();
    const investableAmount = sumBy(investTokens, (token) =>
        priceForAmount({ address: token.address, amount: getUserBalance(token.address) }),
    );
    const userBptBalanceScaledReadable = parseFloat(formatUnits(userBptBalanceScaled, 18));

    const investedAmount =
        (parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares)) *
        userBptBalanceScaledReadable;

    function refetch() {
        userBalancesQuery.refetch();
        userStakedBalanceQuery.refetch();
    }

    return {
        ...userBalances,
        isLoading: userBalancesQuery.isLoading || userStakedBalanceQuery.isLoading,
        isRefetching: userBalancesQuery.isRefetching || userStakedBalanceQuery.isRefetching,
        isError: userBalancesQuery.isError || userStakedBalanceQuery.isError,
        error: userBalancesQuery.error || userStakedBalanceQuery.error,
        userPoolTokenBalances: userBalances,
        refetch,

        userTotalBptBalance: formatFixed(userWalletBptBalance.add(userStakedBptBalanceScaled), 18),
        userWalletBptBalance: formatFixed(userWalletBptBalance, 18),
        userStakedBptBalance: formatFixed(userStakedBptBalanceScaled, 18),
        hasBpt: userBptBalanceScaled.gt(0),
        hasBptInWallet: userWalletBptBalance.gt(0),
        hasBptStaked: userStakedBptBalanceScaled.gt(0),
        investableAmount,
        investedAmount,
    };
}
