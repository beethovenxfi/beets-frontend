import { useTrade } from '~/modules/trade/lib/useTrade';
import { Box, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useBoolean } from '@chakra-ui/hooks';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import CoingeckoLogo from '~/assets/images/coingecko.svg';
import Image from 'next/image';
import { useMemo } from 'react';

interface Props {}

export function TradeCardSwapBreakdown({}: Props) {
    const { priceFor, priceForAmount } = useGetTokens();
    const { reactiveTradeState } = useTrade();
    const { tokenOut, tokenIn } = useTradeData();
    const swapInfo = reactiveTradeState.sorResponse;
    const [rateExpanded, { toggle }] = useBoolean();

    const hasNoticablePriceImpact = parseFloat(swapInfo?.priceImpact || '0') >= 0.01;
    const hasHighPriceImpact = parseFloat(swapInfo?.priceImpact || '0') > 0.05;

    const valueIn = priceForAmount({ address: swapInfo?.tokenIn || '', amount: swapInfo?.tokenInAmount || '0' });
    const tokenOutSwapPrice = valueIn / parseFloat(swapInfo?.tokenOutAmount || '0');
    const diff = priceFor(tokenOut?.address || '') / tokenOutSwapPrice - 1;

    const coingeckoVariationText = useMemo(() => {
        if (diff >= 0) {
            return `cheaper by ${numeral(Math.abs(diff)).format('%0.[00]')}`;
        } else {
            return `within ${numeral(Math.abs(diff)).format('%0.[00]')}`;
        }
    }, [diff]);

    if (!swapInfo || !tokenOut || !tokenIn) {
        return null;
    }

    return (
        <AnimatePresence>
            <VStack backgroundColor='blackAlpha.400' padding='3' width="full" spacing="1" marginTop='1'>
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        Price impact
                    </Text>
                    <Text fontSize=".85rem" color={hasNoticablePriceImpact ? 'beets.red.300' : 'white'}>
                        {numeral(swapInfo.priceImpact).format('0.00%')}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        1 {tokenIn.symbol} is
                    </Text>
                    <Text fontSize=".85rem" color="white">
                        {tokenFormatAmount(swapInfo.effectivePriceReversed)} {tokenOut.symbol}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        1 {tokenOut.symbol} is
                    </Text>
                    <Text fontSize=".85rem" color="white">
                        {tokenFormatAmount(swapInfo.effectivePrice)} {tokenIn.symbol}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <HStack alignItems="center" spacing="1">
                        <Text color="gray.100" fontSize=".85rem">
                            Compared to
                        </Text>
                        <Flex alignItems="center" height="full">
                            <Image src={CoingeckoLogo} alt="Coingecko Logo" width="16" height="16" />
                        </Flex>
                    </HStack>
                    <Text fontSize=".85rem" color="white">
                        {coingeckoVariationText}
                    </Text>
                </HStack>
            </VStack>
        </AnimatePresence>
    );
}
