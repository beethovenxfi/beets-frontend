import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { GqlSorSwapRouteHopFragment } from '~/apollo/generated/graphql-codegen-generated';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Feather } from 'react-feather';
import CoingeckoLogo from '~/assets/images/coingecko.svg';
import Image from 'next/image';
import FantomLogo from '~/assets/images/fantom-logo.png';
import TokenAvatar from '~/components/token/TokenAvatar';

interface Props extends BoxProps {
    hop: GqlSorSwapRouteHopFragment;
}

export function TradeRouteHop({ hop, ...rest }: Props) {
    const { getToken, getRequiredToken, priceForAmount, priceFor } = useGetTokens();
    const tokenOutAmount = parseFloat(hop.tokenOutAmount);
    const tokenOutPrice = priceFor(hop.tokenOut);
    const tokenOutRate = parseFloat(hop.tokenInAmount) / tokenOutAmount;
    const tokenInValue = priceForAmount({ address: hop.tokenIn, amount: hop.tokenInAmount });
    const tokenOutPriceRate = tokenInValue / tokenOutAmount;
    const rateComparePercent = 1 - tokenOutPrice / tokenOutPriceRate;

    const addresses = hop.pool.allTokens
        .filter((token) => !token.isNested && !token.isPhantomBpt)
        .map((token) => token.address);

    return (
        <BeetsBox flex={1} p="4" {...rest}>
            <Flex alignItems="flex-start">
                <Box flex={1}>
                    <TokenAvatarSet
                        imageSize={30}
                        width={112}
                        addresses={[
                            hop.tokenIn,
                            ...addresses.filter((address) => address !== hop.tokenIn && address !== hop.tokenOut),
                            hop.tokenOut,
                        ]}
                    />
                </Box>
                <Flex alignItems="center" fontSize="sm">
                    <Box
                        mr="1"
                        textColor={
                            rateComparePercent > 0.05
                                ? 'orange.500'
                                : rateComparePercent < 0.01
                                ? 'green.500'
                                : undefined
                        }
                    >
                        {rateComparePercent > 0 ? '+' : '-'}
                        {numeral(Math.abs(rateComparePercent)).format('0.[00]%')}{' '}
                    </Box>
                    <Image src={CoingeckoLogo} width="16" height="16" />
                </Flex>
            </Flex>
            {/*<TokenAmountPill address={hop.tokenIn} amount={hop.tokenInAmount} />
            <TokenAmountPill address={hop.tokenOut} amount={hop.tokenOutAmount} />*/}
            {/*<Box mt="6">
                1 {tokenOut.symbol} = {tokenFormatAmount(tokenOutRate)} {tokenIn.symbol} ={' '}
                {numberFormatUSDValue(tokenOutPriceRate)}
                <TokenAvatar address={hop.tokenOut} size="xs" />
            </Box>*/}
            <Flex alignItems="center" mt="6">
                <TokenAmountPill address={hop.tokenOut} amount="1" />
                <Box mx="1">=</Box>
                <TokenAmountPill address={hop.tokenIn} amount={`${tokenOutRate}`} />
                {/*<Box mx="1">= {numberFormatUSDValue(tokenOutPriceRate)}</Box>*/}
            </Flex>
            {/*<Box>
                1 {tokenOut.symbol} = {numberFormatUSDValue(tokenOutPriceRate)}
            </Box>*/}
            {/*<Box>
                {rateComparePercent > 0
                    ? `${numeral(rateComparePercent).format('0.[00]%')} cheaper than`
                    : `within ${numeral(Math.abs(rateComparePercent)).format('0.[00]%')} of`}
            </Box>*/}
        </BeetsBox>
    );
}
