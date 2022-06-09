import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { ChevronsDown } from 'react-feather';
import BeetsButton from '~/components/button/Button';
import Card from '~/components/card/Card';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { useTrade } from '../lib/useTrade';
import { useBatchSwap } from '~/modules/trade/lib/useBatchSwap';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';

type Props = {
    onClose: () => void;
};
export default function TradePreview({ onClose }: Props) {
    const { reactiveTradeState } = useTrade();
    const { getToken } = useGetTokens();
    const { batchSwap, isSubmitting, isPending } = useBatchSwap();

    const formattedOutAmount = reactiveTradeState.sorResponse?.returnAmount || '0';

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
                                <TokenAvatar address={reactiveTradeState.tokenIn || ''} />
                                <Text color="beets.gray.100">{getToken(reactiveTradeState.tokenIn || '')?.symbol}</Text>
                            </HStack>
                            <Text>{reactiveTradeState.swapAmount}</Text>
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
                                <TokenAvatar address={reactiveTradeState.tokenOut || ''} />
                                <Text color="beets.gray.100">
                                    {getToken(reactiveTradeState.tokenOut || '')?.symbol}
                                </Text>
                            </HStack>
                            <Text>{formattedOutAmount}</Text>
                        </HStack>
                    </VStack>
                </VStack>
                <BeetsSubmitTransactionButton
                    marginTop="4"
                    isSubmitting={isSubmitting}
                    isPending={isPending}
                    isDisabled={!reactiveTradeState.sorResponse}
                    onClick={() => batchSwap(reactiveTradeState.sorResponse!)}
                    isFullWidth
                    size="lg"
                >
                    Swap
                </BeetsSubmitTransactionButton>
            </Box>
        </Card>
    );
}
