import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { networkConfig } from '~/lib/config/network-config';
import { LgeData } from '~/lib/services/lge/copper-proxy.service';
import CopperProxyAbi from '~/lib/abi/CopperProxy.json';

export function useCreateLge(lgeData: LgeData) {
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.balancer.vault,
            contractInterface: CopperProxyAbi,
            functionName: 'createAuction',
        },
        transactionType: 'CREATE_LGE',
    });

    function createLge(contractCallData: PoolJoinContractCallData, tokenAmountsIn: TokenAmountHumanReadable[]) {
        const amountsString = tokenAmountsConcatenatedString(tokenAmountsIn, []);

        submit({
            args: [],
            toastText: amountsString,
            walletText: `Join ${lgeData.poolName} with ${amountsString}`,
        });
    }

    return {
        createLge,
        ...rest,
    };
}
