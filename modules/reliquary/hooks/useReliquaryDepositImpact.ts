import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { MaxUint256 } from '@ethersproject/constants';
import { TokenBase } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import ReliquaryAbi from '~/lib/abi/Reliquary.json';
import { useQuery } from 'react-query';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { useRef } from 'react';
import useReliquary from './useReliquary';
import { useProvider } from 'wagmi';
import { BigNumber } from 'ethers';

export function useReliquaryDepositImpact(amount: BigNumber) {
    const networkConfig = useNetworkConfig();
    const provider = useProvider();
    const { currentRelicPosition } = useReliquary();
    const reliquaryService = useRef(
        new ReliquaryService(networkConfig.reliquary.address, networkConfig.chainId, networkConfig.beets.address),
    ).current;
    const depositImpactQuery = useQuery(
        'relicDepositImpact',
        async () => {
            if (!currentRelicPosition) {
                return;
            }
            return await reliquaryService.getDepositImpact({
                relicId: currentRelicPosition?.relicId,
                provider,
                amount,
            });
        },
        {
            enabled: currentRelicPosition !== null && amount !== null,
        },
    );

    return depositImpactQuery;
}
