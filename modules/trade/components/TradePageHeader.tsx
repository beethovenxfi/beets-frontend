import { Flex, HStack, Text } from '@chakra-ui/react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import numeral from 'numeral';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';

export function TradePageHeader() {
    const { tokenOut, tokenIn, currentRatio } = useTradeData();
    const { startingRatio, range } = useTradeChart();
    const percentChange = startingRatio ? (currentRatio - startingRatio) / startingRatio : null;

    return (
        <>
            <Text fontSize="2xl" fontWeight="bold" color="white">
                1
                <Text as="span" fontSize="lg" fontWeight="normal" color="gray.100">
                    {' '}
                    {tokenOut?.symbol}
                    {' = '}
                </Text>
                {tokenFormatAmount(currentRatio)}
                <Text as="span" fontSize="lg" fontWeight="normal" color="gray.100">
                    {' '}
                    {tokenIn?.symbol}
                </Text>
            </Text>
            {percentChange !== null && (
                <HStack>
                    <PercentChangeBadge percentChange={percentChange} />
                    <Text>in the past {range === 'SEVEN_DAY' ? 'week' : 'month'}</Text>
                </HStack>
            )}
        </>
    );
}
