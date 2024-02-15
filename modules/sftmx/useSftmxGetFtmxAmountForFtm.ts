import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useProvider } from 'wagmi';
import { useQuery } from 'react-query';
import { BigNumber } from 'ethers';
import { sftmxService } from '~/lib/services/staking/sftmx.service';

export function useSftmxGetFtmxAmountForFtm(amount: AmountHumanReadable) {
    const provider = useProvider();

    return useQuery(
        ['sftmxGetFtmxAmountForFtm', amount],
        async (): Promise<{ amountSftmx: BigNumber }> => sftmxService.getFtmxAmountForFtm({ amount, provider }),
        { enabled: !!amount && amount !== '0' },
    );
}
