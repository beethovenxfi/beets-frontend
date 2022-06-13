import { useGetPoolBatchSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { formatDistanceToNow } from 'date-fns';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { NetworkStatus } from '@apollo/client';
import BeetsButton from '~/components/button/Button';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import { NextLink } from '~/components/link/NextLink';

export function BatchSwapList() {
    const { priceForAmount } = useGetTokens();
    const { data, fetchMore, networkStatus, loading } = useGetPoolBatchSwapsQuery({
        variables: { first: 5, skip: 0 },
        notifyOnNetworkStatusChange: true,
    });
    const batchSwaps = data?.batchSwaps || [];

    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold">
                Latest swaps
            </Text>
            {batchSwaps.map((batchSwap) => {
                const valueIn = priceForAmount({ address: batchSwap.tokenIn, amount: batchSwap.tokenAmountIn });
                const tokenOutSwapPrice = valueIn / parseFloat(batchSwap.tokenAmountOut);
                const arb = batchSwap.tokenOutPrice / tokenOutSwapPrice - 1;

                return (
                    <BeetsBox key={batchSwap.id} mb={4} p={4} bgColor={arb < 0 ? 'red.800' : 'green.800'}>
                        <Flex alignItems="center">
                            <Flex flex={1} alignItems="center" justifyContent="space-between">
                                <TokenAmountPill address={batchSwap.tokenIn} amount={batchSwap.tokenAmountIn} />
                                {batchSwap.swaps.map((swap, index) => (
                                    <NextLink href={`/pool/${swap.poolId}`} key={index}>
                                        <BeetsBox p={2} cursor="pointer">
                                            <TokenAvatarSet width={120} addresses={swap.poolTokens} imageSize={24} />
                                        </BeetsBox>
                                    </NextLink>
                                ))}
                                <TokenAmountPill address={batchSwap.tokenOut} amount={batchSwap.tokenAmountOut} />
                            </Flex>
                            <Box w={150}>
                                <Text textAlign="right">{numberFormatUSDValue(batchSwap.valueUSD)}</Text>
                            </Box>
                            <Box w={200}>
                                <Text textAlign="right">
                                    {formatDistanceToNow(new Date(batchSwap.timestamp * 1000), {
                                        addSuffix: true,
                                    })}
                                </Text>
                            </Box>
                        </Flex>

                        <Text mt={4}>token swap price: {numeral(tokenOutSwapPrice).format('$0,0.00[000]')}</Text>
                        <Text>token price (external): {numeral(batchSwap.tokenOutPrice).format('$0,0.00[000]')}</Text>
                        {batchSwap.tokenOutPrice ? (
                            <Text color={arb < 0 ? 'red.500' : 'green.500'}>
                                rate: {numeral(arb).format('%0.[000]')}
                            </Text>
                        ) : null}
                    </BeetsBox>
                );
            })}
            <BeetsButton
                width="full"
                isLoading={networkStatus === NetworkStatus.fetchMore}
                onClick={() => {
                    fetchMore({ variables: { skip: batchSwaps.length } }).catch();
                }}
                flex={1}
            >
                Load more
            </BeetsButton>
        </Box>
    );
}
