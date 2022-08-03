import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { isSameAddress } from '@balancer-labs/sdk';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { useSlippage } from '~/lib/global/useSlippage';

export function useJoinPool(pool: GqlPoolUnion) {
    const { slippageDifference } = useSlippage();
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'joinPool',
        transactionType: 'JOIN',
    });

    function joinPool(contractCallData: PoolJoinContractCallData, tokenAmountsIn: TokenAmountHumanReadable[]) {
        const amountsString = tokenAmountsConcatenatedString(tokenAmountsIn, pool.allTokens);

        if (contractCallData.type === 'JoinPool') {
            const ethIndex = contractCallData.assets.findIndex((asset) => asset === AddressZero);

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
        } else if (contractCallData.type === 'BatchSwap') {
            const assets = contractCallData.assets;

            //apply slippage to the bpt out
            const limits = contractCallData.limits.map((limit, i) => {
                if (isSameAddress(assets[i], pool.address)) {
                    return oldBnum(limit.toString()).times(slippageDifference).times(-1).toFixed(0);
                }

                return limit;
            });

            submit({
                args: [
                    0,
                    contractCallData.swaps,
                    contractCallData.assets,
                    {
                        sender: accountData?.address,
                        fromInternalBalance: false,
                        recipient: accountData?.address,
                        toInternalBalance: false,
                    },
                    limits,
                    MaxUint256,
                ],
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
