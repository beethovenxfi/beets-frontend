import { useQuery } from 'react-query';
import { gaugeWithdrawService } from '~/lib/services/staking/gauge-withdraw.service';

export function useGaugeClaimGetContractCallData(gauges: string[]) {
    return useQuery(
        ['unstakeGetContractCallData', gauges],
        () => {
            const contractCallData = gaugeWithdrawService.getGaugeEncodeClaimRewardsCallData({ gauges });

            return [contractCallData];
        },
        { enabled: !!gauges.length, staleTime: 0, cacheTime: 0 },
    );
}
