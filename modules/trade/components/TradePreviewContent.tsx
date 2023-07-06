import { Alert, AlertIcon, Box, Checkbox, HStack, Link, Spinner, StackDivider, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { useGetTokens } from '~/lib/global/useToken';
import { useSlippage } from '~/lib/global/useSlippage';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { InfoButton } from '~/components/info-button/InfoButton';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { GqlLge, GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { TradeCardSwapBreakdown } from './TradeCardSwapBreakdown';

interface Props {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'> & {
        batchSwap: (swapInfo: GqlSorGetSwapsResponseFragment) => void;
    };
    onTransactionSubmitted: () => void;
    lge?: GqlLge;
}

export function TradePreviewContent({ query, onTransactionSubmitted, lge }: Props) {
    const { batchSwap, ...batchSwapQuery } = query;
    const { swapInfo, hasHighPriceImpact, refetchingSwaps } = useTrade();
    const { getToken, formattedPrice } = useGetTokens();
    const { slippage } = useSlippage();
    const tokenIn = getToken(swapInfo?.tokenIn || '');
    const tokenOut = getToken(swapInfo?.tokenOut || '');
    const [highPiAccepted, setHighPiAccepted] = useState(false);
    const { refetch: refetchUserBalances } = useUserTokenBalances();
    const tokenInPrecision = Math.min(tokenIn?.decimals || 18, 12);
    const tokenOutPrecision = Math.min(tokenOut?.decimals || 18, 12);

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

    return (
        <VStack width="full">
            <Box width="full" p="4" pt="0" pb="2">
                <BeetsBox width="full" p="2" px="4">
                    <VStack divider={<StackDivider borderColor="whiteAlpha.200" />} spacing="4" alignItems="flex-start">
                        <HStack justifyContent="space-between" width="full">
                            <HStack>
                                <TokenAvatar
                                    width="40px"
                                    height="40px"
                                    address={swapInfo.tokenIn}
                                    logoURI={
                                        lge?.tokenContractAddress.toLowerCase() === swapInfo.tokenIn
                                            ? lge.tokenIconUrl
                                            : ''
                                    }
                                />
                                <Box>
                                    You sell
                                    <HStack spacing="1">
                                        <Text fontWeight="bold">{tokenIn?.symbol}</Text>
                                        <Link href={etherscanGetTokenUrl(swapInfo.tokenIn)} target="_blank" ml="1.5">
                                            <ExternalLink size={14} />
                                        </Link>
                                    </HStack>
                                </Box>
                            </HStack>
                            <VStack alignItems="flex-end" spacing="0">
                                <HStack>
                                    {!exactIn && refetchingSwaps && <Spinner size="xs" />}
                                    <Text>{tokenFormatAmountPrecise(swapInfo.tokenInAmount, tokenInPrecision)}</Text>
                                </HStack>
                                <Text fontSize="sm" color="beets.base.100">
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
                                <TokenAvatar
                                    width="40px"
                                    height="40px"
                                    address={swapInfo.tokenOut}
                                    logoURI={
                                        lge?.tokenContractAddress.toLowerCase() === swapInfo.tokenOut
                                            ? lge.tokenIconUrl
                                            : ''
                                    }
                                />
                                <Box>
                                    to receive
                                    <HStack spacing="1">
                                        <Text fontWeight="bold">{tokenOut?.symbol}</Text>
                                        <Link href={etherscanGetTokenUrl(swapInfo.tokenOut)} target="_blank" ml="1.5">
                                            <ExternalLink size={14} />
                                        </Link>
                                    </HStack>
                                </Box>
                            </HStack>
                            <VStack alignItems="flex-end" spacing="0">
                                <HStack>
                                    {exactIn && refetchingSwaps && <Spinner size="xs" />}
                                    <Text>{tokenFormatAmountPrecise(swapInfo.tokenOutAmount, tokenOutPrecision)}</Text>
                                </HStack>
                                <Text fontSize="sm" color="beets.base.100">
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
                                label="Max slippage"
                                infoText="The maximum change in the price you are willing to accept to account for external market movements."
                            />
                            <SlippageTextLinkMenu />
                        </HStack>
                        {exactIn ? (
                            <HStack width="full" justifyContent="space-between">
                                <Text>Min {tokenOut?.symbol} received</Text>
                                <Text>{tokenFormatAmountPrecise(minAmountOut, tokenOutPrecision)}</Text>
                            </HStack>
                        ) : (
                            <HStack width="full" justifyContent="space-between">
                                <Text>Max {tokenIn?.symbol} spent</Text>
                                <Text>{tokenFormatAmountPrecise(maxAmountIn, tokenInPrecision)}</Text>
                            </HStack>
                        )}
                    </VStack>
                </BeetsBox>
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
                        marginTop={batchSwapQuery && batchSwapQuery.submitError ? '0' : '4'}
                        fullWidth={true}
                    >
                        Swap
                    </BeetsSubmitTransactionButton>
                </VStack>
            </Box>
            <TradeCardSwapBreakdown isLge={!!lge} />
        </VStack>
    );
}
