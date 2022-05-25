import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { formatUnits } from '@ethersproject/units';
import { ArrowRightCircle, ChevronDown, ChevronRight } from 'react-feather';
import BeetsButton from '~/components/button/Button';
import Card from '~/components/card/Card';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import TradeCard from './TradeCard';
import { tradeContextVar, useTrade } from './tradeState';
import numeral from 'numeral';

type Props = {
    onClose: () => void;
}
export default function TradePreview({ onClose }: Props) {
    const { tradeState } = useTrade();
    const { getToken } = useGetTokens();

    let formattedOutAmount = numeral(formatUnits(
        tradeState.sorResponse?.returnAmount || '0',
        getToken(tradeState.tokenOut || '')?.decimals,
    )).format('0,0.000000');

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
                    <HStack w='full' justifyContent='center' spacing='8'>
                        <HStack>
                            <TokenAvatar address={tradeState.tokenIn || ''} />
                            <Text color="beets.gray.100">
                                {tradeState.swapAmount}&nbsp;{getToken(tradeState.tokenIn || '')?.symbol}
                            </Text>
                        </HStack>
                        <Box color="beets.highlight.alpha.100">
                            <ArrowRightCircle />
                        </Box>
                        <HStack>
                            <TokenAvatar address={tradeState.tokenOut || ''} />
                            <Text color="beets.gray.100">
                                {formattedOutAmount}&nbsp;
                                {getToken(tradeState.tokenOut || '')?.symbol}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
                <BeetsButton marginTop="4" size="lg" isFullWidth>
                    Swap
                </BeetsButton>
            </Box>
        </Card>
    );
}
