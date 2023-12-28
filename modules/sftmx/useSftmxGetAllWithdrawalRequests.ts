import { useProvider } from 'wagmi';
import { useQuery } from 'react-query';
import { sftmxService } from '~/lib/services/staking/sftmx.service';
import { BigNumber } from 'ethers';

export function useSftmxGetAllWithdrawalRequests(wrId: string) {
    const provider = useProvider();

    return useQuery(
        ['sftmxGetAllWithdrawalRequests', wrId],
        async (): Promise<{
            requestTime: number;
            poolAmount: BigNumber;
            undelegateAmount: BigNumber;
            penalty: number;
            user: string;
            isWithdrawn: boolean;
        }> => sftmxService.getAllWithdrawalRequests({ wrId, provider }),
        { enabled: !wrId },
    );
}
