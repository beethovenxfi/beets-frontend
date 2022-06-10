import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { ChevronsDown } from 'react-feather';
import Card from '~/components/card/Card';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { useTrade } from '../lib/useTrade';
import { useBatchSwap } from '~/modules/trade/lib/useBatchSwap';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { TradeCardSwapBreakdown } from '~/modules/trade/components/TradeCardSwapBreakdown';
import { useSlippage } from '~/lib/global/useSlippage';
import numeral from 'numeral';
import { useTradeData } from '~/modules/trade/lib/useTradeData';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Checkbox, CloseButton, Flex } from '@chakra-ui/react';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { useState } from 'react';

type Props = {
    onClose: () => void;
};
export default function TradePreview({ onClose }: Props) {
    const { reactiveTradeState } = useTrade();
    const { getToken } = useGetTokens();
    const { batchSwap, isSubmitting, isPending } = useBatchSwap();
    const { slippage } = useSlippage();
    const swapInfo = reactiveTradeState.sorResponse;
    const tokenIn = getToken(swapInfo?.tokenIn || '');
    const tokenOut = getToken(swapInfo?.tokenOut || '');
    const [highPiAccepted, setHighPiAccepted] = useState(false);

    if (!swapInfo || !tokenIn || !tokenOut) {
        return (
            <Card
                title="Review swap"
                initial={{ transform: 'scale(0)', opacity: 0 }}
                exit={{ transform: 'scale(0)', opacity: 0 }}
                animate={{ transform: 'scale(1)', opacity: 1 }}
                onClose={onClose}
            >
                <Flex height="3xs" alignItems="center" justifyContent="center">
                    Missing swap details.
                </Flex>
            </Card>
        );
    }

    const exactIn = swapInfo.swapType === 'EXACT_IN';
    const maxAmountIn = tokenFormatAmountPrecise(
        oldBnum(swapInfo.tokenInAmount)
            .times(1 + parseFloat(slippage))
            .toString(),
    );
    const minAmountOut = tokenFormatAmountPrecise(
        oldBnum(swapInfo.tokenOutAmount)
            .times(1 - parseFloat(slippage))
            .toString(),
    );
    const hasHighPriceImpact = parseFloat(swapInfo.priceImpact) > 0.05;

    return (
        <Card
            title="Review swap"
            initial={{ transform: 'scale(0)', opacity: 0 }}
            exit={{ transform: 'scale(0)', opacity: 0 }}
            animate={{ transform: 'scale(1)', opacity: 1 }}
            onClose={onClose}
        >
            <Box padding="4">
                <VStack w="full" alignItems="flex-start">
                    <VStack w="full" justifyContent="center" spacing="2">
                        <HStack
                            justifyContent="space-between"
                            w="full"
                            bgColor="blackAlpha.400"
                            padding="2"
                            paddingRight="4"
                            rounded="lg"
                            position="relative"
                        >
                            <HStack>
                                <TokenAvatar address={tokenIn.address} size="sm" />
                                <Text color="beets.gray.100">{tokenIn.symbol}</Text>
                            </HStack>
                            <Text>{tokenFormatAmountPrecise(swapInfo.tokenInAmount, 12)}</Text>
                            <Box
                                justifyContent="center"
                                backgroundColor="beets.gray.600"
                                alignItems="center"
                                rounded="full"
                                border="4px"
                                padding="1"
                                borderColor="blackAlpha.200"
                                position="absolute"
                                bottom="-20px"
                                left="calc(50% - 20px)"
                                zIndex="2"
                                color="beets.green.alpha.100"
                            >
                                <ChevronsDown size={24} />
                            </Box>
                        </HStack>
                        <HStack
                            justifyContent="space-between"
                            w="full"
                            bgColor="blackAlpha.400"
                            padding="2"
                            paddingRight="4"
                            rounded="lg"
                        >
                            <HStack>
                                <TokenAvatar address={tokenOut.address} size="sm" />
                                <Text color="beets.gray.100">{tokenOut.symbol}</Text>
                            </HStack>
                            <Text>{tokenFormatAmountPrecise(swapInfo.tokenOutAmount, 12)}</Text>
                        </HStack>
                    </VStack>
                </VStack>
                <TradeCardSwapBreakdown />
                <Flex>
                    <Box flex="1">Swap type</Box>
                    <Box>{exactIn ? 'Exact in' : 'Exact out'}</Box>
                </Flex>
                <Box mt="6">
                    With{' '}
                    <Text as="span" fontWeight="bold">
                        {numeral(slippage).format('0.[00]%')}
                    </Text>{' '}
                    slippage, you will {exactIn ? 'receive at least' : 'spend at most'}{' '}
                    <Text as="span" fontWeight="bold">
                        {exactIn ? `${minAmountOut} ${tokenOut.symbol}` : `${maxAmountIn} ${tokenIn.symbol}`}
                    </Text>{' '}
                    or the swap will revert.
                </Box>
                {hasHighPriceImpact ? (
                    <Alert status="error" borderRadius="md" mt="4">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>High price impact</AlertTitle>
                            <AlertDescription>
                                This trade is significantly moving the market rate.
                                <Flex mt="2">
                                    <Checkbox
                                        isChecked={highPiAccepted}
                                        onChange={(e) => {
                                            setHighPiAccepted(e.target.checked);
                                        }}
                                    >
                                        I understand
                                    </Checkbox>
                                </Flex>
                            </AlertDescription>
                        </Box>
                    </Alert>
                ) : null}
                <BeetsSubmitTransactionButton
                    marginTop="6"
                    isSubmitting={isSubmitting}
                    isPending={isPending}
                    disabled={hasHighPriceImpact && !highPiAccepted}
                    onClick={() => batchSwap(swapInfo)}
                    isFullWidth
                    size="lg"
                >
                    Swap
                </BeetsSubmitTransactionButton>
            </Box>
        </Card>
    );
}
