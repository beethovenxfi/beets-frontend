import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { useTradeChart } from '~/modules/trade/lib/useTradeChart';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { InfoButton } from '~/components/info-button/InfoButton';
import { protocolThemeProp } from '~/styles/theme-util';

export function TradePageHeader() {
    const { tokenOut, tokenIn, currentRatio, reverseRatio } = useTradeData();
    const { startingRatio, range } = useTradeChart();
    const percentChange = startingRatio ? (reverseRatio - startingRatio) / startingRatio : null;

    return (
        <>
            <Flex>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={protocolThemeProp({ beets: 'white', balancer: 'gray.800' })}
                >
                    1
                    <Text as="span" fontSize="lg" fontWeight="normal" color="inline">
                        {' '}
                        {tokenIn?.symbol}
                        {' = '}
                    </Text>
                    {tokenFormatAmount(reverseRatio)}
                    <Text as="span" fontSize="lg" fontWeight="normal" color="inline">
                        {' '}
                        {tokenOut?.symbol}
                    </Text>
                </Text>
                <Box display="flex" alignItems="flex-end" mb="6px" ml="1">
                    <InfoButton infoText="Global average price" />
                </Box>
            </Flex>
            {percentChange !== null && (
                <HStack>
                    <PercentChangeBadge percentChange={percentChange} />
                    <Text>in the past {range === 'SEVEN_DAY' ? 'week' : 'month'}</Text>
                </HStack>
            )}
        </>
    );
}
