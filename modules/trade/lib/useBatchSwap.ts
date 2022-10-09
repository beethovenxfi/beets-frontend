import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { isSameAddress } from '@balancer-labs/sdk';
import { useSlippage } from '~/lib/global/useSlippage';
import { useGetTokens } from '~/lib/global/useToken';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { isEth, tokenFormatAmount } from '~/lib/services/token/token-util';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useBatchSwap() {
    const { getRequiredToken } = useGetTokens();
    const { userAddress } = useUserAccount();
    const { slippageDifference, slippageAddition } = useSlippage();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            ...vaultContractConfig,
            functionName: 'batchSwap',
        },
        transactionType: 'SWAP',
    });

    function batchSwap({
        swapType,
        swaps,
        tokenAddresses,
        tokenIn,
        tokenOut,
        swapAmount,
        returnAmount,
        tokenInAmount,
        tokenOutAmount,
    }: GqlSorGetSwapsResponseFragment) {
        //TODO: make sure manually added tokens end up in the tokens array or this will throw
        const tokenInDefinition = getRequiredToken(tokenIn);
        const tokenOutDefinition = getRequiredToken(tokenOut);

        // Limits:
        // +ve means max to send
        // -ve means min to receive
        // For a multihop the intermediate tokens should be 0
        const limits = tokenAddresses.map((tokenAddress, i) => {
            if (swapType === 'EXACT_IN') {
                if (isSameAddress(tokenAddress, tokenIn) || (isEth(tokenIn) && tokenAddress === AddressZero)) {
                    return parseUnits(tokenInAmount, tokenInDefinition.decimals).toString();
                } else if (isSameAddress(tokenAddress, tokenOut) || (isEth(tokenOut) && tokenAddress === AddressZero)) {
                    return oldBnumScaleAmount(tokenOutAmount, tokenOutDefinition.decimals)
                        .times(slippageDifference)
                        .times(-1)
                        .toFixed(0);
                }
            } else if (swapType === 'EXACT_OUT') {
                if (isSameAddress(tokenAddress, tokenIn) || (isEth(tokenIn) && tokenAddress === AddressZero)) {
                    return oldBnumScaleAmount(tokenInAmount, tokenInDefinition.decimals)
                        .times(slippageAddition)
                        .toFixed(0);
                } else if (isSameAddress(tokenAddress, tokenOut) || (isEth(tokenOut) && tokenAddress === AddressZero)) {
                    return parseUnits(tokenOutAmount, tokenOutDefinition.decimals).toString();
                }
            }

            return '0';
        });

        submit({
            args: [
                swapType === 'EXACT_IN' ? 0 : 1,
                swaps,
                tokenAddresses,
                {
                    sender: userAddress,
                    fromInternalBalance: false,
                    recipient: userAddress,
                    toInternalBalance: false,
                },
                limits,
                MaxUint256,
            ],
            toastText: `${tokenFormatAmount(tokenInAmount)} ${tokenInDefinition.symbol} -> ${tokenFormatAmount(
                tokenOutAmount,
            )} ${tokenOutDefinition.symbol}`,
            ...(isEth(tokenIn)
                ? {
                      overrides: {
                          value:
                              swapType === 'EXACT_IN'
                                  ? parseUnits(tokenInAmount, 18)
                                  : oldBnumScaleAmount(tokenInAmount, 18).times(slippageAddition).toFixed(0),
                      },
                  }
                : {}),
        });
    }

    return {
        batchSwap,
        ...rest,
    };
}
