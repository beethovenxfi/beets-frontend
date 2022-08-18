import { useTrade } from '~/modules/trade/lib/useTrade';
import { useGetTradeSelectedTokenDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useEffect } from 'react';
import { useGetTokens } from '~/lib/global/useToken';

export function useTradeData() {
    const { getToken, priceFor } = useGetTokens();
    const { reactiveTradeState } = useTrade();
    const tokenIn = getToken(reactiveTradeState.tokenIn);
    const tokenOut = getToken(reactiveTradeState.tokenOut);
    const currentRatio = priceFor(reactiveTradeState.tokenOut) / priceFor(reactiveTradeState.tokenIn);
    const reverseRatio = priceFor(reactiveTradeState.tokenIn) / priceFor(reactiveTradeState.tokenOut);

    const query = useGetTradeSelectedTokenDataQuery({
        variables: { tokenIn: reactiveTradeState.tokenIn, tokenOut: reactiveTradeState.tokenOut },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        query.refetch({ tokenIn: reactiveTradeState.tokenIn, tokenOut: reactiveTradeState.tokenOut });
    }, [reactiveTradeState.tokenIn, reactiveTradeState.tokenOut]);

    return {
        ...query,
        ...query.data,
        tokenIn,
        tokenOut,
        currentRatio,
        reverseRatio,
    };
}
