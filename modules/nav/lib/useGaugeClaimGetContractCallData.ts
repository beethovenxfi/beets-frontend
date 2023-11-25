import { useQuery } from 'react-query';
import { gaugeService } from '~/lib/services/staking/gauge.service';
import { Zero } from '@ethersproject/constants';

export function useGaugeClaimGetContractCallData(
    hasPendingNonBALRewards: boolean,
    hasPendingBalRewards: boolean,
    gauges: string[],
) {
    return useQuery(
        ['claimGetContractCallData', gauges],
        () => {
            const contractCallData = gaugeService.getGaugeClaimRewardsContractCallData({
                hasPendingNonBALRewards,
                hasPendingBalRewards,
                gauges,
                outputReference: Zero,
            });

            return contractCallData;
        },
        {
            enabled: gauges && !!gauges.length && (hasPendingNonBALRewards || hasPendingBalRewards),
            staleTime: 0,
            cacheTime: 0,
        },
    );
}
