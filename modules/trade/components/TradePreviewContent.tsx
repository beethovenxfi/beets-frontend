import {
    Alert,
    AlertIcon,
    Box,
    Checkbox,
    Container,
    Divider,
    Flex,
    HStack,
    Link,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
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
import { ChevronRight, ExternalLink } from 'react-feather';
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
        <VStack width="full">
            <Box width="full" p="4" pt="0" pb="2">
                <BeetsBox width="full" p="2" px="4">
                    <VStack divider={<StackDivider borderColor="whiteAlpha.200" />} spacing="4" alignItems="flex-start">
                        <HStack justifyContent="space-between" width="full">
                            <HStack>
                                <TokenAvatar width="40px" height="40px" address={swapInfo.tokenIn} />
                                <Text>
                                    You sell
                                    <HStack spacing="1">
                                        <Text fontWeight="bold">{tokenIn?.symbol}</Text>
                                        <Link href={etherscanGetTokenUrl(swapInfo.tokenIn)} target="_blank" ml="1.5">
                                            <ExternalLink size={14} />
                                        </Link>
                                    </HStack>
                                </Text>
                            </HStack>
                            <VStack alignItems="flex-end" spacing="0">
                                <Text>{swapInfo.tokenInAmount}</Text>
                                <Text fontSize='sm' color="beets.base.100">
                                    ~
                                    {formattedPrice({
                                        address: swapInfo.tokenIn,
                                        amount: swapInfo.tokenInAmount,
                                    })}
                                </Text>
                            </VStack>
                        </HStack>
                        <HStack justifyContent="space-between" width="full">
                            <HStack>
                                <TokenAvatar width="40px" height="40px" address={swapInfo.tokenOut} />
                                <Text>
                                    to receive
                                    <HStack spacing='1'>
                                        <Text fontWeight="bold">{tokenOut?.symbol}</Text>
                                        <Link href={etherscanGetTokenUrl(swapInfo.tokenOut)} target="_blank" ml="1.5">
                                            <ExternalLink size={14} />
                                        </Link>
                                    </HStack>
                                </Text>
                            </HStack>
                            <VStack alignItems="flex-end" spacing="0">
                                <Text>{swapInfo.tokenOutAmount}</Text>
                                <Text fontSize='sm' color="beets.base.100">
                                    ~
                                    {formattedPrice({
                                        address: swapInfo.tokenOut,
                                        amount: swapInfo.tokenOutAmount,
                                    })}
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                </BeetsBox>
                <BeetsBox mt="4" p="2" px="4">
                    <VStack>
                        <HStack width="full" justifyContent="space-between">
                            <InfoButton
                                labelProps={{ fontSize: 'sm' }}
                                label="Max slippage"
                                infoText="The maximum change in the price you are willing to accept to account for external market movements"
                            />
                            <SlippageTextLinkMenu />
                        </HStack>
                        <HStack width="full" justifyContent="space-between">
                            <Text color="gray.100" fontSize=".85rem">
                                Minimum received
                            </Text>
                            <Text fontSize=".85rem" color="white">
                                {swapInfo?.tokenOutAmount} {tokenOut?.symbol}
                            </Text>
                        </HStack>
                    </VStack>
                </BeetsBox>
                {/* <BeetsBox marginTop="4">
                    <VStack py="2">
                        <HStack>
                            <HStack>
                                <TokenAvatar width="24px" height="24px" address={swapInfo.tokenIn} />
                                <Text>1 {tokenIn?.symbol}</Text>
                            </HStack>
                            <ChevronRight size="16" />
                            <HStack>
                                <TokenAvatar width="24px" height="24px" address={swapInfo.tokenOut} />
                                <Text>1 {tokenOut?.symbol}</Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </BeetsBox> */}
                <VStack width="full" spacing="4">
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
                    {batchSwapQuery && batchSwapQuery.submitError ? (
                        <Alert status="error" mt={4}>
                            <AlertIcon />
                            {transactionMessageFromError(batchSwapQuery.submitError)}
                        </Alert>
                    ) : null}
                    <BeetsSubmitTransactionButton
                        {...batchSwapQuery}
                        isDisabled={hasHighPriceImpact && !highPiAccepted}
                        onClick={() => batchSwap(swapInfo)}
                        onPending={onTransactionSubmitted}
                        onConfirmed={() => refetchUserBalances()}
                        width="full"
                        size="lg"
                        marginTop="4"
                    >
                        Swap
                    </BeetsSubmitTransactionButton>
                </VStack>
            </Box>
            {/* <CardRow>
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
                </CardRow> */}
            {/* <CardRow>
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
                </CardRow> */}
            {/* <CardRow mb="0">
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            infoText="The maximum change in the price you are willing to accept to account for external market movements"
                        />
                    </Box>

                    <SlippageTextLinkMenu />
                </CardRow> */}

            {/* <Card p="2">
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
     
                            Price impact
                        </Box>
                        <Box color={hasHighPriceImpact ? 'white' : hasNoticeablePriceImpact ? 'orange' : 'current'}>
                            {numeral(swapInfo.priceImpact).format('0.00%')}
                        </Box>
                    </CardRow>
                    {exactIn ? (
                        <CardRow>
                            <Box flex="1">
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
            ) : null} */}

            <VStack width="full" py="4" backgroundColor="whiteAlpha.50" px="5">
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        Price impact
                    </Text>
                    <Text
                        fontSize=".85rem"
                        color={hasHighPriceImpact ? 'beets.red' : hasNoticeablePriceImpact ? 'orange' : 'white'}
                    >
                        {numeral(priceImpact).format('0.00%')}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        1 {tokenIn?.symbol} is
                    </Text>
                    <Text fontSize=".85rem" color="white">
                        {tokenFormatAmount(swapInfo.effectivePriceReversed)} {tokenOut?.symbol}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        1 {tokenOut?.symbol} is
                    </Text>
                    <Text fontSize=".85rem" color="white">
                        {tokenFormatAmount(swapInfo.effectivePrice)} {tokenIn?.symbol}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between">
                    <HStack alignItems="center" spacing="1">
                        <Text color="gray.100" fontSize=".85rem">
                            Compared to
                        </Text>
                        <Flex alignItems="center" height="full">
                            <CoingeckoIcon width="16px" height="16px" />
                        </Flex>
                    </HStack>
                    <Text color="white" fontSize=".85rem">
                        {coingeckoVariationText}
                    </Text>
                </HStack>
            </VStack>
        </VStack>
    );
}
