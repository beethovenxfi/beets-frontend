import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { PoolJoinPoolContractCallData } from '~/lib/services/pool/pool-types';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';

import { useUserAccount } from '~/lib/user/useUserAccount';
import { useCompose } from '~/modules/compose/ComposeProvider';

export function useInitJoinPool(poolId?: string) {
    const { userAddress } = useUserAccount();
    const { poolName } = useCompose();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            ...vaultContractConfig,
            functionName: 'joinPool',
        },
        transactionType: 'JOIN',
    });

    function initJoinPool(
        contractCallData: PoolJoinPoolContractCallData,
        tokenAmountsIn: TokenAmountHumanReadable[],
        tokenMetadata: GqlToken[],
    ) {
        const amountsString = tokenAmountsConcatenatedString(tokenAmountsIn, tokenMetadata);
        submit({
            args: [
                poolId,
                userAddress,
                userAddress,
                {
                    assets: contractCallData.assets,
                    maxAmountsIn: contractCallData.maxAmountsIn,
                    userData: contractCallData.userData,
                    fromInternalBalance: false,
                },
            ],
            toastText: amountsString,
            walletText: `Initialising ${poolName} with ${amountsString}`,
        });
    }

    return {
        initJoinPool,
        ...rest,
    };
}
