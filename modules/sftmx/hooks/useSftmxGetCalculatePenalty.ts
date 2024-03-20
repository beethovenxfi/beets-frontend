import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useProvider } from 'wagmi';
import { useQuery } from 'react-query';
import { BigNumber } from 'ethers';
import { sftmxService } from '~/lib/services/staking/sftmx.service';

export function useSftmxGetCalculatePenalty(amount: AmountHumanReadable) {
    const provider = useProvider();

    return useQuery(
        ['sftmxGetCalculatePenalty', amount],
        async (): Promise<{
            amountFtmReceived: BigNumber;
            amountUndelegated: BigNumber;
            amountPenalty: BigNumber;
        }> => sftmxService.getCalculatePenalty({ amount, provider }),
        { enabled: !!amount && amount !== '0' },
    );
}
