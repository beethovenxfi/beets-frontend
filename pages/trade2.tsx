import { Box, Grid, GridItem, Heading, HStack, VStack } from '@chakra-ui/layout';
import Card from '~/components/card/Card';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import TradeCard from '~/modules/trade/components/TradeCard2';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useTradeData } from '~/modules/trade/lib/useTradeData';

export default function Trade2() {
    const { tokenOut, tokenIn, currentRatio } = useTradeData();

    const _tokenIn = tokenIn?.address || '';
    const _tokenOut = tokenOut?.address || '';
    return (
        <Grid paddingX="8" width="full" templateColumns="repeat(12, 1fr)" gap="12">
            <GridItem w="100%" colStart={5} colSpan={4}>
                <VStack spacing="4">
                    <HStack>
                        <TokenAvatarSet
                            width={150}
                            imageSize={48}
                            tokenData={[{ address: _tokenIn }, { address: _tokenOut }]}
                        />
                        {/* <Heading fontSize='2xl'>{tokenFormatAmount(currentRatio)}</Heading> */}
                    </HStack>
                    <TradeCard />
                </VStack>
            </GridItem>
        </Grid>
    );
}
