import { SwapTypes } from '@balancer-labs/sdk';
import { useQuery } from 'react-query';
import { poolQueryBatchSwap } from '~/lib/services/pool/lib/util';
import { useProvider } from 'wagmi';
import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { formatFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';

export function useOnChainSwapInfoQuery(swapInfo: GqlSorGetSwapsResponseFragment | null) {
    const { getTokenDecimals } = useGetTokens();
    const provider = useProvider();

    const { data: onChainSwapInfo, ...batchSwapQuery } = useQuery(
        [
            'queryBatchSwap',
            swapInfo?.tokenIn,
            swapInfo?.tokenOut,
            swapInfo?.swapType,
            swapInfo?.swapType === 'EXACT_IN' ? swapInfo.tokenInAmount : swapInfo ? swapInfo.tokenOutAmount : undefined,
            JSON.stringify(swapInfo?.swaps),
        ],
        async () => {
            if (!swapInfo) {
                return null;
            }

            const response = await poolQueryBatchSwap({
                provider,
                swapType: swapInfo.swapType === 'EXACT_IN' ? SwapTypes.SwapExactIn : SwapTypes.SwapExactOut,
                swaps: swapInfo.swaps,
                assets: swapInfo.tokenAddresses,
            });

            const tokenInIndex = swapInfo.tokenAddresses.indexOf(swapInfo.tokenIn);
            const tokenOutIndex = swapInfo.tokenAddresses.indexOf(swapInfo.tokenOut);
            const tokenInValueScaled = BigNumber.from(response[tokenInIndex]).abs().toString();
            const tokenOutValueScaled = BigNumber.from(response[tokenOutIndex]).abs().toString();

            const tokenInAmount =
                swapInfo.swapType === 'EXACT_IN'
                    ? swapInfo.tokenInAmount
                    : formatFixed(tokenInValueScaled, getTokenDecimals(swapInfo.tokenIn));
            const tokenOutAmount =
                swapInfo.swapType === 'EXACT_OUT'
                    ? swapInfo.tokenOutAmount
                    : formatFixed(tokenOutValueScaled, getTokenDecimals(swapInfo.tokenOut));

            if (swapInfo.swapType === 'EXACT_IN' && swapInfo.tokenOutAmount === tokenOutAmount) {
                return null;
            }

            if (swapInfo.swapType === 'EXACT_OUT' && swapInfo.tokenInAmount === tokenInAmount) {
                return null;
            }

            return {
                ...swapInfo,
                tokenInAmount,
                tokenOutAmount,
                swapAmount: swapInfo.swapType === 'EXACT_IN' ? tokenInAmount : tokenOutAmount,
                returnAmount: swapInfo.swapType === 'EXACT_IN' ? tokenOutAmount : tokenInAmount,
                returnAmountScaled: swapInfo.swapType === 'EXACT_IN' ? tokenInValueScaled : tokenOutValueScaled,
            };
        },
        { enabled: !!swapInfo && swapInfo.swaps.length > 0, refetchInterval: 7500, cacheTime: 0 },
    );

    const isValid =
        swapInfo &&
        onChainSwapInfo &&
        swapInfo.swapType === onChainSwapInfo.swapType &&
        ((swapInfo.swapType === 'EXACT_IN' && swapInfo.tokenInAmount === onChainSwapInfo.tokenInAmount) ||
            (swapInfo.swapType === 'EXACT_OUT' && swapInfo.tokenOutAmount === onChainSwapInfo.tokenOutAmount));

    return {
        onChainSwapInfo: isValid ? onChainSwapInfo : null,
        ...batchSwapQuery,
    };
}
