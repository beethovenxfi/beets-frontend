import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

import { useQuery } from 'react-query';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { useRef } from 'react';
import useReliquary from './useReliquary';
import { useProvider } from 'wagmi';

export function useReliquaryDepositImpact(amount: number) {
    const networkConfig = useNetworkConfig();
    const provider = useProvider();
    const { selectedRelic } = useReliquary();
    const reliquaryService = useRef(
        new ReliquaryService(networkConfig.reliquary.address, networkConfig.chainId, networkConfig.beets.address),
    ).current;
    const depositImpactQuery = useQuery(
        'relicDepositImpact',
        async () => {
            if (!selectedRelic) {
                return;
            }
            return await reliquaryService.getDepositImpact({
                relicId: selectedRelic?.relicId,
                provider,
                amount,
            });
        },
        {
            enabled: selectedRelic !== null && amount !== null,
        },
    );

    return depositImpactQuery;
}
