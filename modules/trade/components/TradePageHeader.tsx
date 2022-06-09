import { Text } from '@chakra-ui/react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import numeral from 'numeral';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';

export function TradePageHeader() {
    const { tokenOut, tokenIn, currentRatio } = useTradeData();
    const { startingRatio, range } = useTradeChart();
    const percentChange = startingRatio ? (currentRatio - startingRatio) / startingRatio : null;

    return (
        <>
            <Text textStyle="h1">
                1
                <Text as="span" fontSize="3xl" fontWeight="light">
                    {' '}
                    {tokenOut?.symbol}
                    {' = '}
                </Text>
                {tokenFormatAmount(currentRatio)}
                <Text as="span" fontSize="3xl" fontWeight="light">
                    {' '}
                    {tokenIn?.symbol}
                </Text>
            </Text>
            {percentChange !== null ? (
                <Text>
                    <Text as="span" color={percentChange < 0 ? 'beets.red.300' : 'beets.green.500'}>
                        {numeral(percentChange).format('+0.[00]%')}
                    </Text>{' '}
                    in the past {range === 'SEVEN_DAY' ? 'week' : 'month'}
                </Text>
            ) : null}
        </>
    );
}
