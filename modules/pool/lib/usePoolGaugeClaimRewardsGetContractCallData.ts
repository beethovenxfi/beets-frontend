import { useQuery } from 'react-query';
import { usePool } from '~/modules/pool/lib/usePool';
import { gaugeService } from '~/lib/services/staking/gauge.service';
import { usePoolUserPendingRewards } from './usePoolUserPendingRewards';
import { Zero } from '@ethersproject/constants';

export function usePoolGaugeClaimRewardsGetContractCallData() {
    const { pool } = usePool();
    const { hasPendingBalRewards, hasPendingNonBALRewards } = usePoolUserPendingRewards();

    const data = {
        hasPendingNonBALRewards,
        hasPendingBalRewards,
        outputReference: Zero,
        gauges: [pool.staking?.gauge?.id || ''],
    };

    return useQuery(['unstakeGetContractCallData', data], () => {
        const contractCallData = gaugeService.getGaugeClaimRewardsContractCallData(data);
        return contractCallData;
    });
}
