import { Badge, Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import {
    BatchSwapDashedLine,
    BatchSwapRouteDashedLineArrowSpacer,
} from '~/components/batch-swap/components/BatchSwapDashedLine';
import { BatchSwapTokenAmount } from '~/components/batch-swap/components/BatchSwapTokenAmount';
import { GqlPoolBatchSwapFragment, GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { BatchSwapHop } from '~/components/batch-swap/components/BatchSwapHop';
import { useGetTokens } from '~/lib/global/useToken';
import Card from '~/components/card/Card';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, User } from 'react-feather';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { etherscanGetAddressUrl, etherscanGetTxUrl } from '~/lib/util/etherscan';
import { Fragment } from 'react';

interface Props {
    batchSwap: GqlPoolBatchSwapFragment;
    tokenIn: GqlToken | null;
    tokenOut: GqlToken | null;
    tokenInPrice: number;
    tokenOutPrice: number;
}

export function BatchSwapListItem({ tokenIn, tokenOut, tokenInPrice, tokenOutPrice, batchSwap }: Props) {
    const exchangeRate = parseFloat(batchSwap.tokenAmountIn) / parseFloat(batchSwap.tokenAmountOut);
    const percentChange = tokenInPrice !== 0 ? (tokenOutPrice / tokenInPrice - exchangeRate) / exchangeRate : 0;

    return (
        <Card px="2" pt="2" mb="1">
            <Flex alignItems="center">
                <Flex flex="1" fontSize="sm" alignItems="flex-end">
                    <Text fontSize="md" fontWeight="bold">
                        1
                    </Text>
                    <Text>
                        {'\u00A0'}
                        {tokenOut?.symbol} ={'\u00A0'}
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                        {tokenFormatAmount(exchangeRate)}
                    </Text>
                    <Text>
                        {'\u00A0'}
                        {tokenIn?.symbol}
                    </Text>
                </Flex>

                <HStack>
                    <Link href={etherscanGetTxUrl(batchSwap.tx)} target="_blank" mr="1">
                        <ExternalLink size={16} />
                    </Link>
                    <Link href={etherscanGetAddressUrl(batchSwap.userAddress)} target="_blank">
                        <User size={16} />
                    </Link>
                </HStack>
            </Flex>
            <Flex>
                <Box flex="1">
                    <PercentChangeBadge percentChange={percentChange} />
                </Box>
                <Box>
                    <Badge>{formatDistanceToNow(new Date(batchSwap.timestamp * 1000), { addSuffix: true })}</Badge>
                </Box>
            </Flex>
            <Box height="64px">
                <Flex flex="1" flexDirection="column" justifyContent="space-around">
                    <Flex position="relative" columnGap="5px">
                        <BatchSwapDashedLine stroke="gray.200" />
                        <BatchSwapTokenAmount
                            address={batchSwap.tokenIn}
                            amount={batchSwap.tokenAmountIn}
                            padding="19.5px 0px"
                            bgColor="beets.base.700"
                        />
                        <Flex flex="1" height="64px" alignItems="center" position="relative" top="2px">
                            <BatchSwapRouteDashedLineArrowSpacer />
                            {batchSwap.swaps
                                .filter((swap) => swap.pool.type !== 'LINEAR')
                                .map((swap, index) => (
                                    <Fragment key={index}>
                                        <BatchSwapHop hop={swap} />
                                        <BatchSwapRouteDashedLineArrowSpacer />
                                    </Fragment>
                                ))}
                        </Flex>
                        <BatchSwapTokenAmount
                            address={batchSwap.tokenOut}
                            amount={batchSwap.tokenAmountOut}
                            padding="19.5px 0px"
                            bgColor="beets.base.700"
                        />
                    </Flex>
                </Flex>
            </Box>
        </Card>
    );
}
