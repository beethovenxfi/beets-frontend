import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { MaxUint256 } from '@ethersproject/constants';
import { TokenBase } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import ReliquaryAbi from '~/lib/abi/Reliquary.json';

export function useReliquaryLevelUp() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.reliquary.address,
            contractInterface: ReliquaryAbi,
            functionName: 'updatePosition',
        },
        transactionType: 'UPDATE',
    });

    function levelUp(relicId: number) {
        submit({
            args: [relicId],
            toastText: `Level Up relic #${relicId}`,
        });
    }

    return {
        levelUp,
        ...rest,
    };
}
