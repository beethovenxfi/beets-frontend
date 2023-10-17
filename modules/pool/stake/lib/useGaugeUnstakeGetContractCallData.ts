import { useQuery } from 'react-query';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { gaugeService } from '~/lib/services/staking/gauge.service';
import { BigNumberish } from '@ethersproject/bignumber';
import { usePoolUserPendingRewards } from '../../lib/usePoolUserPendingRewards';
import { GqlPoolStakingOtherGauge } from '~/apollo/generated/graphql-codegen-generated';
import { Zero } from '@ethersproject/constants';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useGaugeUnstakeGetContractCallData(
    amount: BigNumberish,
    customWithdrawalGauge?: GqlPoolStakingOtherGauge,
) {
    const { userAddress } = useUserAccount();
    const { pool } = usePool();
    const { hasPendingBalRewards, hasPendingNonBALRewards, isLoading } = usePoolUserPendingRewards();
    const networkConfig = useNetworkConfig();

    const data = {
        hasPendingNonBALRewards,
        hasPendingBalRewards,
        gauges: [customWithdrawalGauge?.gaugeAddress || pool.staking?.id || ''],
        sender: userAddress || '',
        recipient: userAddress || '',
        amount,
        outputReference: Zero,
    };

    return useQuery(
        ['unstakeGetContractCallData', data],
        () => {
            const contractCallData = gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(data);
            return contractCallData;
        },
        { enabled: networkConfig.gaugeEnabled && !isLoading && amount.toString() !== '0' },
    );
}
