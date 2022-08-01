import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlTokenChartDataRange,
    useGetTokenRelativePriceChartDataQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useEffect } from 'react';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';

const tradeChartRangeVar = makeVar<GqlTokenChartDataRange>('SEVEN_DAY');

export function useTradeChart() {
    const { reactiveTradeState } = useTrade();
    const range = useReactiveVar(tradeChartRangeVar);

    const query = useGetTokenRelativePriceChartDataQuery({
        variables: {
            tokenIn: replaceEthWithWeth(reactiveTradeState.tokenIn),
            tokenOut: replaceEthWithWeth(reactiveTradeState.tokenOut),
            range,
        },
        notifyOnNetworkStatusChange: true,
    });

    function setRange(range: GqlTokenChartDataRange) {
        tradeChartRangeVar(range);
    }

    useEffect(() => {
        query.refetch({
            tokenIn: replaceEthWithWeth(reactiveTradeState.tokenIn),
            tokenOut: replaceEthWithWeth(reactiveTradeState.tokenOut),
            range,
        });
    }, [range, reactiveTradeState.tokenIn, reactiveTradeState.tokenOut]);

    return {
        ...query,
        range,
        setRange,
        startingRatio: query.data && query.data.prices[0] ? parseFloat(query.data.prices[0].price) : undefined,
    };
}
