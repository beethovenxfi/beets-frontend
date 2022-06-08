import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlTokenChartDataRange,
    useGetTokenRelativePriceChartDataQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useEffect } from 'react';

const tradeChartRangeVar = makeVar<GqlTokenChartDataRange>('SEVEN_DAY');

export function useTradeChart() {
    const { tradeState } = useTrade();
    const range = useReactiveVar(tradeChartRangeVar);

    const query = useGetTokenRelativePriceChartDataQuery({
        variables: { tokenIn: tradeState.tokenIn, tokenOut: tradeState.tokenOut, range },
        notifyOnNetworkStatusChange: true,
    });

    function setRange(range: GqlTokenChartDataRange) {
        tradeChartRangeVar(range);
    }

    useEffect(() => {
        query.refetch({ tokenIn: tradeState.tokenIn, tokenOut: tradeState.tokenOut, range });
    }, [range, tradeState.tokenIn, tradeState.tokenOut]);

    return {
        ...query,
        range,
        setRange,
        startingRatio: query.data ? parseFloat(query.data.prices[0].price) : undefined,
    };
}
