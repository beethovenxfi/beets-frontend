import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import {
    GqlPoolUnion,
    GqlSorGetSwapsResponse,
    GqlSorGetSwapsResponseFragment,
    GqlSorSwapType,
} from '~/apollo/generated/graphql-codegen-generated';
import { PoolExitContractCallData } from '~/lib/services/pool/pool-types';
import { useAccount } from 'wagmi';
import { tokenAmountsConcatenatedString } from '~/lib/services/token/token-util';
import { isSameAddress } from '@balancer-labs/sdk';
import { useSlippage } from '~/lib/global/useSlippage';
import { useGetTokens } from '~/lib/global/useToken';
import { parseUnits } from 'ethers/lib/utils';
import { oldBnum, oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { MaxUint256 } from '@ethersproject/constants';

export function useBatchSwap() {
    const { getRequiredToken } = useGetTokens();
    const { data: accountData } = useAccount();
    const { slippageDifference } = useSlippage();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: vaultContractConfig,
        functionName: 'batchSwap',
        toastType: 'SWAP',
    });

    function batchSwap({
        swapType,
        swaps,
        tokenAddresses,
        tokenIn,
        tokenOut,
        swapAmount,
        returnAmount,
    }: GqlSorGetSwapsResponseFragment) {
        //TODO: make sure manually added tokens end up in the tokens array or this will throw
        const tokenInDefinition = getRequiredToken(tokenIn);
        const tokenOutDefinition = getRequiredToken(tokenOut);

        // Limits:
        // +ve means max to send
        // -ve means min to receive
        // For a multihop the intermediate tokens should be 0
        const limits = tokenAddresses.map((tokenAddress, i) => {
            if (swapType === 'EXACT_IN' && isSameAddress(tokenAddress, tokenIn)) {
                return parseUnits(swapAmount, getRequiredToken(tokenIn).decimals).toString();
            } else if (swapType === 'EXACT_OUT' && isSameAddress(tokenAddress, tokenOut)) {
                return oldBnumScaleAmount(swapAmount, tokenOutDefinition.decimals)
                    .times(slippageDifference)
                    .times(-1)
                    .toFixed(0);
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
        });
    }

    return {
        batchSwap,
        ...rest,
    };
}
