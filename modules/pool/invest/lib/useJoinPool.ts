import { batchRelayerContractConfig, useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { isSameAddress } from '@balancer-labs/sdk';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { useSlippage } from '~/lib/global/useSlippage';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { networkConfig } from '~/lib/config/network-config';
import { poolRequiresBatchRelayerOnJoin } from '~/lib/services/pool/pool-util';

export function useJoinPool(pool: GqlPoolUnion, zapEnabled?: boolean) {
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config:
            zapEnabled || poolRequiresBatchRelayerOnJoin(pool)
                ? batchRelayerContractConfig
                : {
                      ...vaultContractConfig,
                      functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'joinPool',
                  },
        transactionType: 'JOIN',
    });

    function joinPool(contractCallData: PoolJoinContractCallData, tokenAmountsIn: TokenAmountHumanReadable[]) {
        const amountsString = tokenAmountsConcatenatedString(tokenAmountsIn, pool.allTokens);

        if (contractCallData.type === 'JoinPool') {
            const ethIndex = contractCallData.assets.findIndex((asset) => asset === AddressZero);

            submit({
                args: [
                    pool.id,
                    userAddress,
                    userAddress,
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
            submit({
                args: [
                    0,
                    contractCallData.swaps,
                    contractCallData.assets,
                    {
                        sender: userAddress,
                        fromInternalBalance: false,
                        recipient: userAddress,
                        toInternalBalance: false,
                    },
                    contractCallData.limits,
                    MaxUint256,
                ],
                toastText: amountsString,
                walletText: `Join ${pool.name} with ${amountsString}`,
            });
        } else if (contractCallData.type === 'BatchRelayer') {
            submit({
                args: [contractCallData.calls],
                toastText: zapEnabled ? `Zap into ${networkConfig.farmTypeName} with ${amountsString}` : amountsString,
                walletText: zapEnabled
                    ? `Join ${pool.name} with ${amountsString} and Zap into the ${networkConfig.farmTypeName}.`
                    : `Join ${pool.name} with ${amountsString}`,
                ...(contractCallData.ethValue
                    ? {
                          overrides: {
                              value: contractCallData.ethValue,
                          },
                      }
                    : {}),
            });
        }
    }

    return {
        joinPool,
        ...rest,
    };
}
