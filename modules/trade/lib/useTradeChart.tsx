import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlTokenChartDataRange,
    useGetTokenRelativePriceChartDataQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { useEffect } from 'react';

const tradeChartRangeVar = makeVar<GqlTokenChartDataRange>('SEVEN_DAY');

export function useTradeChart() {
    const { reactiveTradeState } = useTrade();
    const range = useReactiveVar(tradeChartRangeVar);

    const query = useGetTokenRelativePriceChartDataQuery({
        variables: { tokenIn: reactiveTradeState.tokenIn, tokenOut: reactiveTradeState.tokenOut, range },
        notifyOnNetworkStatusChange: true,
    });

    function setRange(range: GqlTokenChartDataRange) {
        tradeChartRangeVar(range);
    }

    useEffect(() => {
        query.refetch({
            tokenIn: reactiveTradeState.tokenIn,
            tokenOut: reactiveTradeState.tokenOut,
            range,
        });
    }, [range, reactiveTradeState.tokenIn, reactiveTradeState.tokenOut]);

    return {
        ...query,
        range,
        setRange,
        startingRatio: query.data ? parseFloat(query.data.prices[0].price) : undefined,
    };
}
