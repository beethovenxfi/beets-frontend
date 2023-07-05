import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { networkConfig } from '~/lib/config/network-config';
import { LgeData } from '~/lib/services/lge/copper-proxy.service';
import CopperProxyAbi from '~/lib/abi/CopperProxy.json';

export function useLgeCreateLge() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.copperProxyAddress,
            contractInterface: CopperProxyAbi,
            functionName: 'createAuction',
        },
        transactionType: 'CREATE_LGE',
    });

    function createLge(lgeData: LgeData, lgeTokens: TokenAmountHumanReadable[], tokens: TokenBase[]) {
        const amountsString = tokenAmountsConcatenatedString(lgeTokens, tokens);

        submit({
            args: [lgeData],
            toastText: amountsString,
            walletText: `Create ${lgeData.name} with ${amountsString}`,
        });
    }

    return {
        createLge,
        ...rest,
    };
}
