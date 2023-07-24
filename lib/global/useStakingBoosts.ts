import { usePool } from '~/modules/pool/lib/usePool';
import { useUserAccount } from '../user/useUserAccount';
import BigNumber from 'bignumber.js';
import { useQuery } from 'react-query';
import { gaugeStakingService } from '../services/staking/gauge-staking.service';
import { useProvider } from 'wagmi';
import { useUserData } from '../user/useUserData';
import { useGetAppGlobalDataQuery } from '~/apollo/generated/graphql-codegen-generated';

/**
 * calcUserBoost
 *
 * Pure function for calculating a user's boost for a given gauge.
 * Attribution: Balancer Frontend / staking-rewards-service.ts
 *
 * @param {string} userGaugeBalance - User's balance in gauge.
 * @param {string} gaugeTotalSupply - The gauge's total supply.
 * @param {string} userVeBALBalance - User's veBAL balance.
 * @param {string} veBALTotalSupply - veBAL total supply.
 * @returns User's boost value for given gauge.
 */
function calcUserBoost({
    userGaugeBalance,
    gaugeTotalSupply,
    userVeBALBalance,
    veBALTotalSupply,
}: {
    userGaugeBalance: string;
    gaugeTotalSupply: string;
    userVeBALBalance: string;
    veBALTotalSupply: string;
}): string {
    const _userGaugeBalance = new BigNumber(userGaugeBalance);
    const _gaugeTotalSupply = new BigNumber(gaugeTotalSupply);
    const _userVeBALBalance = new BigNumber(userVeBALBalance);
    const _veBALTotalSupply = new BigNumber(veBALTotalSupply);

    const boost = new BigNumber(1).plus(
        new BigNumber(1.5)
            .times(_userVeBALBalance)
            .div(_veBALTotalSupply)
            .times(_gaugeTotalSupply)
            .div(_userGaugeBalance),
    );

    const minBoost = new BigNumber(2.5).lt(boost) ? new BigNumber(2.5) : boost;
    if (minBoost.isNaN()) {
        return '0.0'.toString();
    }
    return minBoost.toString();
}

function calculateBoostFromGauge(
    workingBalance: number,
    workingSupply: number,
    totalSupply: number,
    userBalance: number,
    userVeBAL: number,
    totalVeBAL: number,
) {
    // initializes variables for max boost and boost
    let boost = 0.0;
    let veBalShare = userVeBAL / totalVeBAL;
    let userBalanceAdjusted = userBalance / 10e17;
    // Takes into account the above changes on the working balance and working supply due to additional veBAL or liquidity
    // This can only be an approximation without pulling in the actual veBAL balance of all users to determine
    // if those with max boost would be moved below the max boost threshhold.
    let workingBalanceAdjusted = Math.min(
        0.4 * userBalanceAdjusted + 0.6 * (totalSupply / 10e17) * veBalShare,
        userBalance / 10e17,
    );

    let workingSupplyAdjusted =
        (workingSupply - workingBalance - (totalSupply - userBalance) * 0.4 + (totalSupply - userBalance) * 0.4) /
            10e17 +
        workingBalanceAdjusted;

    if (workingBalanceAdjusted) {
        boost =
            workingBalanceAdjusted /
            workingSupplyAdjusted /
            ((0.4 * userBalanceAdjusted) /
                (0.4 * userBalanceAdjusted + workingSupplyAdjusted - workingBalanceAdjusted));
    }

    return boost.toString();
}

export default function useStakingBoosts() {
    const { pool } = usePool();
    const { userAddress } = useUserAccount();
    const { veBALBalance } = useUserData();
    const { data: globalData, loading: isLoadingGlobalData } = useGetAppGlobalDataQuery();

    const veBALTotalSupply = globalData?.veBALTotalSupply || '0.0';
    const provider = useProvider();

    const gaugeAddress = pool.staking?.gauge?.gaugeAddress || '';
    const gaugeVersion = pool.staking?.gauge?.version || 1;
    const { data: stakedBalance, isLoading: isLoadingStakedBalance } = useQuery(
        ['gaugeBalance', userAddress, gaugeAddress, gaugeVersion],
        async () => {
            const balance = gaugeStakingService.getUserStakedBalance({
                userAddress: userAddress as string,
                gaugeAddress,
                gaugeVersion,
                provider,
            });
            return balance;
        },
    );

    const { data: totalSupply, isLoading: isLoadingTotalSupply } = useQuery(
        ['gaugeTotalSupply', gaugeAddress],
        async () => {
            const totalSupply = gaugeStakingService.getGaugeTotalSupply({
                gaugeAddress,
                provider,
            });
            return totalSupply;
        },
    );

    const { data: workingSupply, isLoading: isLoadingWorkingSupply } = useQuery(
        ['gaugeWorkingSupply', gaugeAddress],
        async () => {
            const workingSupply = gaugeStakingService.getGaugeWorkingSupply({
                gaugeAddress,
                provider,
            });
            return workingSupply;
        },
    );

    const { data: workingBalance, isLoading: isLoadingWorkingBalance } = useQuery(
        ['gaugeWorkingBalance', userAddress, gaugeAddress],
        async () => {
            const workingBalances = gaugeStakingService.getGaugeWorkingBalance({
                userAddress: userAddress as string,
                gaugeAddress,
                provider,
            });
            return workingBalances;
        },
    );

    const isLoading =
        isLoadingStakedBalance ||
        isLoadingTotalSupply ||
        isLoadingGlobalData ||
        isLoadingWorkingSupply ||
        isLoadingWorkingBalance;

    let boost = calcUserBoost({
        userGaugeBalance: stakedBalance || '0',
        userVeBALBalance: veBALBalance || '0',
        gaugeTotalSupply: totalSupply || '0',
        veBALTotalSupply: veBALTotalSupply || '0',
    });

    console.log({
        boost,
        boostNew: calculateBoostFromGauge(
            parseFloat(workingBalance || ''),
            parseFloat(workingSupply || ''),
            parseFloat(totalSupply || ''),
            parseFloat(stakedBalance || ''),
            parseFloat(veBALBalance || ''),
            parseFloat(veBALTotalSupply || ''),
        ),
    });

    return {
        isLoading,
        boost,
    };
}
