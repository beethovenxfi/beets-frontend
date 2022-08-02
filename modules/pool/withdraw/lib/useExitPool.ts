import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolExitContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function useExitPool(pool: GqlPoolUnion) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'exitPool',
        transactionType: 'EXIT',
    });

    function exitPool(contractCallData: PoolExitContractCallData, withdrawAmounts: TokenAmountHumanReadable[]) {
        if (contractCallData.type === 'ExitPool') {
            const amountsString = tokenAmountsConcatenatedString(withdrawAmounts, pool.allTokens);

            submit({
                args: [
                    pool.id,
                    accountData?.address,
                    accountData?.address,
                    {
                        assets: contractCallData.assets,
                        minAmountsOut: contractCallData.minAmountsOut,
                        userData: contractCallData.userData,
                        toInternalBalance: false,
                    },
                ],
                toastText: amountsString,
                walletText: `Withdraw from ${pool.name} with ${amountsString}`,
            });
        }
    }

    return {
        exitPool,
        ...rest,
    };
}
