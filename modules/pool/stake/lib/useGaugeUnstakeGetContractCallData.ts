import { useQuery } from 'react-query';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { gaugeWithdrawService } from '~/lib/services/staking/gauge-withdraw.service';
import { BigNumberish } from '@ethersproject/bignumber';
import { usePoolUserPendingRewards } from '../../lib/usePoolUserPendingRewards';
import { GqlPoolStakingOtherGauge } from '~/apollo/generated/graphql-codegen-generated';

export function useGaugeUnstakeGetContractCallData(
    amount: BigNumberish,
    customWithdrawalGauge?: GqlPoolStakingOtherGauge,
) {
    const { userAddress } = useUserAccount();
    const { pool } = usePool();
    const { hasPendingBalRewards, hasPendingNonBALRewards } = usePoolUserPendingRewards();

    const data = {
        hasPendingNonBALRewards,
        hasPendingBalRewards,
        gauge: customWithdrawalGauge?.gaugeAddress || pool.staking?.id || '',
        sender: userAddress || '',
        recipient: userAddress || '',
        amount,
    };

    return useQuery(
        ['unstakeGetContractCallData', data],
        async () => {
            const contractCallData = await gaugeWithdrawService.getGaugeClaimRewardsAndWithdrawContractCallData(data);

            return contractCallData;
        },
        { enabled: hasPendingNonBALRewards || hasPendingBalRewards, staleTime: 0, cacheTime: 0 },
    );
}
