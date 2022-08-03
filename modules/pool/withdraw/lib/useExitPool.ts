import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { PoolExitContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { isSameAddress } from '@balancer-labs/sdk';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { MaxUint256 } from '@ethersproject/constants';
import { useSlippage } from '~/lib/global/useSlippage';

export function useExitPool(pool: GqlPoolUnion) {
    const { data: accountData } = useAccount();
    const { slippageDifference } = useSlippage();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: pool.__typename === 'GqlPoolPhantomStable' ? 'batchSwap' : 'exitPool',
        transactionType: 'EXIT',
    });

    function exitPool(contractCallData: PoolExitContractCallData, withdrawAmounts: TokenAmountHumanReadable[]) {
        const amountsString = tokenAmountsConcatenatedString(withdrawAmounts, pool.allTokens);

        if (contractCallData.type === 'ExitPool') {
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
        } else if (contractCallData.type === 'BatchSwap') {
            const assets = contractCallData.assets;

            //apply slippage to the bpt out
            const limits = contractCallData.limits.map((limit, i) => {
                if (!isSameAddress(assets[i], pool.address)) {
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
                walletText: `Withdraw from ${pool.name} with ${amountsString}`,
            });
        }
    }

    return {
        exitPool,
        ...rest,
    };
}
