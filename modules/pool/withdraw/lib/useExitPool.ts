import { useSubmitTransaction, vaultContractConfig } from '~/lib/global/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';

export function useExitPool(pool: GqlPoolUnion) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'exitPool',
        toastType: 'EXIT',
    });

    function exitPool(contractCallData: PoolJoinContractCallData, tokenAmountsIn: TokenAmountHumanReadable[]) {
        if (contractCallData.type === 'JoinPool') {
            submit({
                args: [
                    pool.id,
                    accountData?.address,
                    accountData?.address,
                    {
                        assets: contractCallData.assets,
                        maxAmountsIn: contractCallData.maxAmountsIn,
                        userData: contractCallData.userData,
                        fromInternalBalance: false,
                    },
                ],
                toastText: tokenAmountsConcatenatedString(tokenAmountsIn, pool.allTokens),
            });
        }
    }

    return {
        exitPool,
        ...rest,
    };
}
