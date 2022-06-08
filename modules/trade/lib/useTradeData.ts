import { useTrade } from '~/modules/trade/lib/useTrade';
import { useGetTradeSelectedTokenDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useEffect } from 'react';
import { useGetTokens } from '~/lib/global/useToken';

export function useTradeData() {
    const { getToken, priceFor } = useGetTokens();
    const { tradeState } = useTrade();
    const tokenIn = getToken(tradeState.tokenIn);
    const tokenOut = getToken(tradeState.tokenOut);
    const currentRatio = priceFor(tradeState.tokenOut) / priceFor(tradeState.tokenIn);

    const query = useGetTradeSelectedTokenDataQuery({
        variables: { tokenIn: tradeState.tokenIn, tokenOut: tradeState.tokenOut },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        query.refetch({ tokenIn: tradeState.tokenIn, tokenOut: tradeState.tokenOut });
    }, [tradeState.tokenIn, tradeState.tokenOut]);

    return {
        ...query,
        ...query.data,
        tokenIn,
        tokenOut,
        currentRatio,
    };
}
