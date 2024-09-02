import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useGetFbeetsRatioQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { parseUnits } from 'ethers/lib/utils';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { useProvider } from 'wagmi';
import { useQuery } from 'react-query';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { freshBeetsService } from '~/lib/services/staking/fresh-beets.service';
import { formatFixed } from '@ethersproject/bignumber';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';
import { BigNumber } from 'ethers';

const DUST_THRESHOLD = BigNumber.from('1000000000000');

export function _usePoolUserBptBalance() {
    const { pool } = usePool();
    const { userWalletBptBalance, ...userWalletBalanceQuery } = usePoolUserBptWalletBalance();
    const { data: userStakedBptBalance, ...userStakedBalanceQuery } = usePoolUserStakedBalance([
        pool.staking?.gauge?.gaugeAddress || '',
    ]);
    const { data: legacyGaugeStakedBptBalance, ...legacyGaugeStakedBalanceQuery } = usePoolUserStakedBalance(
        pool.staking?.gauge?.otherGauges?.map((gauge) => gauge.gaugeAddress) || [],
    );
    const userStakedBptBalanceScaled = parseUnits(
        (userStakedBptBalance && typeof userStakedBptBalance === 'object'
            ? userStakedBptBalance.amount
            : userStakedBptBalance) || '0',
        18,
    );

    // this one is only used for the legacy gauge migration
    const userLegacyGaugeStakedBptBalanceScaled = parseUnits(
        legacyGaugeStakedBptBalance && typeof legacyGaugeStakedBptBalance === 'object'
            ? legacyGaugeStakedBptBalance.amount
            : '0',
        18,
    );
    const userTotalBptBalanceScaled = userWalletBptBalance.add(userStakedBptBalanceScaled);
    const userTotalBptBalance = formatFixed(userTotalBptBalanceScaled, 18);
    const userPercentShare = parseFloat(userTotalBptBalance) / parseFloat(pool.dynamicData.totalShares);

    async function refetch() {
        await userWalletBalanceQuery.refetch();
        await legacyGaugeStakedBalanceQuery.refetch();
        await userStakedBalanceQuery.refetch();
    }

    return {
        isLoading:
            userWalletBalanceQuery.isLoading ||
            userStakedBalanceQuery.isLoading ||
            legacyGaugeStakedBalanceQuery.isLoading,
        isRefetching:
            userWalletBalanceQuery.isRefetching ||
            userStakedBalanceQuery.isRefetching ||
            legacyGaugeStakedBalanceQuery.isFetching,
        isError:
            userWalletBalanceQuery.isError || userStakedBalanceQuery.isError || legacyGaugeStakedBalanceQuery.isError,
        error: userWalletBalanceQuery.error || userStakedBalanceQuery.error || legacyGaugeStakedBalanceQuery.error,
        refetch,

        userTotalBptBalance: formatFixed(userWalletBptBalance.add(userStakedBptBalanceScaled), 18),
        userWalletBptBalance: formatFixed(userWalletBptBalance, 18),
        userStakedBptBalance: formatFixed(userStakedBptBalanceScaled, 18),
        userLegacyGaugeStakedBptBalance: formatFixed(userLegacyGaugeStakedBptBalanceScaled, 18),
        userLegacyGaugeStakedGaugeAddress:
            (legacyGaugeStakedBptBalance &&
                typeof legacyGaugeStakedBptBalance === 'object' &&
                legacyGaugeStakedBptBalance.address) ||
            '',
        hasBpt: userTotalBptBalanceScaled.gt(DUST_THRESHOLD),
        hasBptInWallet: userWalletBptBalance.gt(DUST_THRESHOLD),
        hasBptStaked: userStakedBptBalanceScaled.gt(DUST_THRESHOLD),
        userPercentShare,
    };
}

function usePoolUserBptWalletBalance() {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();
    const isFbeetsPool = pool.id === networkConfig.fbeets.poolId;
    const { data: fbeets } = useGetFbeetsRatioQuery();

    const { userBalances, ...userBalancesQuery } = useUserBalances(
        isFbeetsPool ? [pool.address, networkConfig.fbeets.address] : [pool.address],
        [pool],
    );

    const userWalletBptBalance = parseUnits(tokenGetAmountForAddress(pool.address, userBalances), 18);

    function getUserFbeetsPoolBptBalance() {
        const fBeetsBalance = tokenGetAmountForAddress(networkConfig.fbeets.address, userBalances);
        const fbeetsBalanceInBpt = oldBnumScaleAmount(fBeetsBalance)
            .times(fbeets?.ratio || '0')
            .toFixed(0);

        return userWalletBptBalance.add(fbeetsBalanceInBpt);
    }

    return {
        ...userBalancesQuery,
        userWalletBptBalance: isFbeetsPool ? getUserFbeetsPoolBptBalance() : userWalletBptBalance,
    };
}

export function usePoolUserStakedBalance(stakingAddresses: string[]) {
    const { pool } = usePool();
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const { data: fBeets } = useGetFbeetsRatioQuery();

    return useQuery(
        ['poolUserStakedBalance', pool.id, pool.staking?.id || '', userAddress || '', stakingAddresses],
        async (): Promise<AmountHumanReadable | TokenAmountHumanReadable> => {
            if (!userAddress || !pool.staking) {
                return '0';
            }

            switch (pool.staking.type) {
                case 'MASTER_CHEF':
                    return masterChefService.getUserStakedBalance({
                        userAddress,
                        farmId: pool.staking.id,
                        provider,
                    });
                case 'FRESH_BEETS':
                    return freshBeetsService.getUserStakedBalance({
                        userAddress,
                        farmId: pool.staking.id,
                        provider,
                        fBeetsRatio: fBeets?.ratio || '0',
                    });
                case 'GAUGE':
                    for (const stakingAddress of stakingAddresses) {
                        const balance = await gaugeStakingService.getUserStakedBalance({
                            userAddress,
                            gaugeAddress: stakingAddress || '',
                            provider,
                        });

                        if (balance !== '0.0') {
                            return {
                                address: stakingAddress,
                                amount: balance,
                            };
                        }
                    }
                    return '0';
                default:
                case 'RELIQUARY':
                    //TODO: implement
                    return '0';
            }
        },
        {},
    );
}

export const PoolUserBptBalanceContext = createContext<ReturnType<typeof _usePoolUserBptBalance> | null>(null);

export function PoolUserBptBalanceProvider(props: { children: ReactNode }) {
    const value = _usePoolUserBptBalance();

    return <PoolUserBptBalanceContext.Provider value={value}>{props.children}</PoolUserBptBalanceContext.Provider>;
}

export function usePoolUserBptBalance() {
    return useContext(PoolUserBptBalanceContext) as ReturnType<typeof _usePoolUserBptBalance>;
}
