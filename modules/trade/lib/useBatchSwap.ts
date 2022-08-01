import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useAccount } from 'wagmi';
import { isSameAddress } from '@balancer-labs/sdk';
import { useSlippage } from '~/lib/global/useSlippage';
import { useGetTokens } from '~/lib/global/useToken';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { isEth } from '~/lib/services/token/token-util';

export function useBatchSwap() {
    const { getRequiredToken } = useGetTokens();
    const { data: accountData } = useAccount();
    const { slippageDifference, slippageAddition } = useSlippage();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: 'batchSwap',
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
            if (
                swapType === 'EXACT_IN' &&
                (isSameAddress(tokenAddress, tokenOut) || (isEth(tokenOut) && tokenAddress === AddressZero))
            ) {
                return oldBnumScaleAmount(tokenOutAmount, tokenOutDefinition.decimals)
                    .times(slippageDifference)
                    .times(-1)
                    .toFixed(0);
            } else if (
                swapType === 'EXACT_OUT' &&
                (isSameAddress(tokenAddress, tokenIn) || (isEth(tokenIn) && tokenAddress === AddressZero))
            ) {
                return oldBnumScaleAmount(tokenInAmount, tokenInDefinition.decimals).times(slippageAddition).toFixed(0);
            }

            return '0';
        });

        submit({
            args: [
                swapType === 'EXACT_IN' ? 0 : 1,
                swaps,
                tokenAddresses,
                {
                    sender: accountData?.address,
                    fromInternalBalance: false,
                    recipient: accountData?.address,
                    toInternalBalance: false,
                },
                limits,
                MaxUint256,
            ],
            toastText:
                swapType === 'EXACT_IN'
                    ? `${swapAmount} ${tokenInDefinition.symbol} -> ${returnAmount} ${tokenOutDefinition.symbol}`
                    : `${returnAmount} ${tokenInDefinition.symbol} -> ${swapAmount} ${tokenOutDefinition.symbol}`,
            ...(isEth(tokenIn)
                ? {
                      overrides: {
                          value: swapType === 'EXACT_IN' ? parseUnits(swapAmount, 18) : '0',
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
