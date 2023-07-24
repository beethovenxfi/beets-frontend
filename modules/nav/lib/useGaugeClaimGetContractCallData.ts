import { useQuery } from 'react-query';
import { gaugeService } from '~/lib/services/staking/gauge.service';

export function useGaugeClaimGetContractCallData(gauges: string[]) {
    return useQuery(
        ['claimGetContractCallData', gauges],
        () => {
            const contractCallData = gaugeService.getGaugeEncodeClaimRewardsCallData({ gauges });

            return contractCallData;
        },
        { enabled: !!gauges.length, staleTime: 0, cacheTime: 0 },
    );
}
