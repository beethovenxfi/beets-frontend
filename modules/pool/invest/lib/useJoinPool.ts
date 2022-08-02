import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { AddressZero } from '@ethersproject/constants';

export function useJoinPool(pool: GqlPoolUnion) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'joinPool',
        transactionType: 'JOIN',
    });

    function joinPool(contractCallData: PoolJoinContractCallData, tokenAmountsIn: TokenAmountHumanReadable[]) {
        if (contractCallData.type === 'JoinPool') {
            const ethIndex = contractCallData.assets.findIndex((asset) => asset === AddressZero);
            const amountsString = tokenAmountsConcatenatedString(tokenAmountsIn, pool.allTokens);

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
                ...(ethIndex !== -1
                    ? {
                          overrides: {
                              value: contractCallData.maxAmountsIn[ethIndex],
                          },
                      }
                    : {}),
                toastText: amountsString,
                walletText: `Join ${pool.name} with ${amountsString}`,
            });
        }
    }

    return {
        joinPool,
        ...rest,
    };
}
