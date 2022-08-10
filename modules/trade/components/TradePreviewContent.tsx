import { Alert, AlertIcon, Box, Checkbox, Flex, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import Card from '~/components/card/Card';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useGetTokens } from '~/lib/global/useToken';
import { useSlippage } from '~/lib/global/useSlippage';
import { tokenFormatAmount, tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { CardRow } from '~/components/card/CardRow';
import { InfoButton } from '~/components/info-button/InfoButton';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { CoingeckoIcon } from '~/assets/icons/CoingeckoIcon';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';

interface Props {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'> & {
        batchSwap: (swapInfo: GqlSorGetSwapsResponseFragment) => void;
    };
    onTransactionSubmitted: () => void;
}

export function TradePreviewContent({ query, onTransactionSubmitted }: Props) {
    const { batchSwap, ...batchSwapQuery } = query;
    const { reactiveTradeState, hasNoticeablePriceImpact, hasHighPriceImpact, priceImpact } = useTrade();
    const { getToken, formattedPrice, priceForAmount, priceFor } = useGetTokens();
    const { slippage } = useSlippage();
    const swapInfo = reactiveTradeState.sorResponse;
    const tokenIn = getToken(swapInfo?.tokenIn || '');
    const tokenOut = getToken(swapInfo?.tokenOut || '');
    const [highPiAccepted, setHighPiAccepted] = useState(false);
    const { refetch: refetchUserBalances } = useUserTokenBalances();

    if (!swapInfo) {
        //TODO: handle
        return null;
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

    const exchangeRate = parseFloat(swapInfo.tokenOutAmount) / parseFloat(swapInfo.tokenInAmount);
    const reverseExchangeRate = parseFloat(swapInfo.tokenInAmount) / parseFloat(swapInfo.tokenOutAmount);
    const valueIn = priceForAmount({ address: swapInfo.tokenIn, amount: swapInfo.tokenInAmount });
    const tokenOutSwapPrice = valueIn / parseFloat(swapInfo.tokenOutAmount);
    const diff = priceFor(swapInfo.tokenOut) / tokenOutSwapPrice - 1;
    const coingeckoVariationText =
        diff >= 0
            ? `${numeral(Math.abs(diff)).format('%0.[00]')} cheaper`
            : `within ${numeral(Math.abs(diff)).format('%0.[00]')}`;

    //console.log('query.submitError', query.submitError ? query.submitError.reason : null);

    return (
        <Box>
            <BeetsBox p="2">
                <CardRow>
                    <Box flex="1">
                        <Flex alignItems="center">
                            <Box mr="1">Selling</Box>
                            <TokenAvatar width="20px" height="20px" address={swapInfo.tokenIn} />
                        </Flex>
                    </Box>
                    <Box>
                        <Flex alignItems="center">
                            <Box fontWeight="bold">
                                {tokenFormatAmountPrecise(swapInfo.tokenInAmount)}{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenIn?.symbol}
                                </Text>
                            </Box>
                            <Link href={etherscanGetTokenUrl(swapInfo.tokenIn)} target="_blank" ml="1.5">
                                <ExternalLink size={14} />
                            </Link>
                        </Flex>
                        <Box textAlign="right" fontSize="sm" color="gray.200">
                            {formattedPrice({ address: swapInfo.tokenIn, amount: swapInfo.tokenInAmount })}
                        </Box>
                    </Box>
                </CardRow>
                <CardRow>
                    <Box flex="1">
                        <Flex alignItems="center">
                            <Box mr="1">Buying</Box>
                            <TokenAvatar width="20px" height="20px" address={swapInfo.tokenOut} />
                        </Flex>
                    </Box>
                    <Box>
                        <Flex alignItems="center">
                            <Box fontWeight="bold">
                                {tokenFormatAmountPrecise(swapInfo.tokenOutAmount)}{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenOut?.symbol}
                                </Text>
                            </Box>
                            <Link href={etherscanGetTokenUrl(swapInfo.tokenOut)} target="_blank" ml="1.5">
                                <ExternalLink size={14} />
                            </Link>
                        </Flex>
                        <Box textAlign="right" fontSize="sm" color="gray.200">
                            {formattedPrice({
                                address: swapInfo.tokenOut,
                                amount: swapInfo.tokenOutAmount,
                            })}
                        </Box>
                    </Box>
                </CardRow>
                <CardRow mb="0">
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            infoText="The maximum change in the price you are willing to accept to account for external market movements"
                        />
                    </Box>

                    <SlippageTextLinkMenu />
                </CardRow>
            </BeetsBox>
            <Box mt="6">
                <Box fontWeight="semibold" fontSize="lg" mb="2">
                    Transaction details
                </Box>

                <Card p="2">
                    <CardRow>
                        <Box flex="1">Effective price</Box>
                        <Box>
                            <Box fontWeight="bold" textAlign="right">
                                1{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenIn?.symbol} =
                                </Text>{' '}
                                {tokenFormatAmount(exchangeRate)}{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenOut?.symbol}
                                </Text>
                            </Box>
                            <Box fontWeight="bold" textAlign="right">
                                1{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenOut?.symbol} =
                                </Text>{' '}
                                {tokenFormatAmount(reverseExchangeRate)}{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenIn?.symbol}
                                </Text>
                            </Box>
                        </Box>
                    </CardRow>
                    <CardRow
                        bgColor={hasHighPriceImpact ? 'red' : 'whiteAlpha.100'}
                        fontWeight={hasHighPriceImpact ? 'bold' : 'normal'}
                    >
                        <Box flex="1" color={hasHighPriceImpact ? 'white' : 'current'}>
                            {/*<InfoButton
                                label="Price impact"
                                moreInfoUrl="https://docs.beets.fi"
                                infoText="Lorem ipsum dolor...."
                            />*/}
                            Price impact
                        </Box>
                        <Box color={hasHighPriceImpact ? 'white' : hasNoticeablePriceImpact ? 'orange' : 'current'}>
                            {numeral(swapInfo.priceImpact).format('0.00%')}
                        </Box>
                    </CardRow>
                    {exactIn ? (
                        <CardRow>
                            <Box flex="1">
                                {/*<InfoButton label="Minimum received" infoText="Lorem ipsum dolor...." />*/}
                                Minimum received
                            </Box>
                            <Box fontWeight="bold">
                                {tokenFormatAmount(minAmountOut)}{' '}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenOut?.symbol}
                                </Text>
                            </Box>
                        </CardRow>
                    ) : (
                        <CardRow>
                            <Box flex="1">
                                {/*<InfoButton label="Maximum spent" infoText="Lorem ipsum dolor...." />*/}
                                Maximum spent
                            </Box>
                            <Box fontWeight="bold">
                                {tokenFormatAmount(maxAmountIn)}
                                <Text as="span" fontSize="sm" fontWeight="normal">
                                    {tokenIn?.symbol}
                                </Text>
                            </Box>
                        </CardRow>
                    )}
                    <CardRow mb="0">
                        <Flex flex="1" alignItems="center">
                            <Box mr="1">Compared to</Box>
                            <CoingeckoIcon width="18px" height="18px" />
                        </Flex>
                        <Box color={diff > 0 ? 'current' : diff < -0.15 ? 'red' : diff < -0.02 ? 'orange' : 'current'}>
                            {coingeckoVariationText}
                        </Box>
                    </CardRow>
                </Card>
            </Box>
            {hasHighPriceImpact && (
                <Alert status="error" mt="4" display="flex" alignItems="flex-start">
                    <Checkbox
                        colorScheme="red"
                        mt="1"
                        mr="4"
                        isChecked={highPiAccepted}
                        onChange={() => setHighPiAccepted(!highPiAccepted)}
                    />
                    <Box>I understand that this trade will significantly move the market price.</Box>
                </Alert>
            )}
            <BeetsSubmitTransactionButton
                {...batchSwapQuery}
                isDisabled={hasHighPriceImpact && !highPiAccepted}
                onClick={() => batchSwap(swapInfo)}
                onPending={onTransactionSubmitted}
                onConfirmed={() => refetchUserBalances()}
                width="full"
                size="lg"
                marginTop="6"
            >
                Swap
            </BeetsSubmitTransactionButton>
            {batchSwapQuery && batchSwapQuery.submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    {transactionMessageFromError(batchSwapQuery.submitError)}
                </Alert>
            ) : null}
        </Box>
    );
}
