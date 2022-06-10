import { useTrade } from '~/modules/trade/lib/useTrade';
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useBoolean } from '@chakra-ui/hooks';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import CoingeckoLogo from '~/assets/images/coingecko.svg';
import Image from 'next/image';

interface Props {}

export function TradeCardSwapBreakdown({}: Props) {
    const { priceFor, priceForAmount } = useGetTokens();
    const { reactiveTradeState } = useTrade();
    const { tokenOut, tokenIn } = useTradeData();
    const swapInfo = reactiveTradeState.sorResponse;
    const [rateExpanded, { toggle }] = useBoolean();

    if (!swapInfo || !tokenOut || !tokenIn) {
        return null;
    }

    const hasNoticablePriceImpact = parseFloat(swapInfo.priceImpact) >= 0.01;
    const hasHighPriceImpact = parseFloat(swapInfo.priceImpact) > 0.05;

    const valueIn = priceForAmount({ address: swapInfo.tokenIn, amount: swapInfo.tokenInAmount });
    const tokenOutSwapPrice = valueIn / parseFloat(swapInfo.tokenOutAmount);
    const diff = priceFor(tokenOut.address) / tokenOutSwapPrice - 1;

    return (
        <AnimatePresence>
            <Box w="full" pt="4">
                <Box borderTopWidth={1} borderTopColor="beets.gray.300" borderTopStyle="dashed" pt="4">
                    <Flex alignItems="center" mb="2">
                        <Box flex="1">Price impact</Box>
                        <Box color={hasNoticablePriceImpact ? 'beets.red.300' : undefined}>
                            {numeral(swapInfo.priceImpact).format('0.00%')}
                        </Box>
                    </Flex>
                    <Flex alignItems="center">
                        <Link flex="1" onClick={toggle} userSelect="none">
                            <HStack spacing="0" position="relative">
                                <Text>Rate</Text>
                                <Box pt="1" color="beets.highlight.alpha.100">
                                    {rateExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </Box>
                            </HStack>
                        </Link>
                        <Box>
                            1 {tokenOut.symbol} = {tokenFormatAmount(swapInfo.effectivePrice)} {tokenIn.symbol}
                        </Box>
                    </Flex>
                    {rateExpanded ? (
                        <Box textAlign="right">
                            1 {tokenIn.symbol} = {tokenFormatAmount(swapInfo.effectivePriceReversed)} {tokenOut.symbol}
                        </Box>
                    ) : null}
                    <Flex justifyContent="flex-end" color={diff >= 0 ? 'beets.green.500' : undefined}>
                        <HStack>
                            <Text mr="1">
                                {diff >= 0
                                    ? `${numeral(Math.abs(diff)).format('%0.[00]')} cheaper than`
                                    : `Within ${numeral(Math.abs(diff)).format('%0.[00]')} of`}
                            </Text>
                            <Image src={CoingeckoLogo} width="16" height="16" />
                        </HStack>
                    </Flex>
                </Box>
            </Box>
        </AnimatePresence>
    );
}
