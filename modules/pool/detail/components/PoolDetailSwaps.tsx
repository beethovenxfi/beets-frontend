import { usePool } from '~/modules/pool/lib/usePool';
import { useGetPoolSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { ArrowRight, ExternalLink } from 'react-feather';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { etherscanGetTxUrl } from '~/lib/util/etherscan';
import { formatDistanceToNow } from 'date-fns';

export function PoolDetailSwaps() {
    const { pool } = usePool();
    const { data } = useGetPoolSwapsQuery({
        variables: { where: { poolIdIn: [pool.id] } },
        pollInterval: 7500,
    });
    const swaps = data?.swaps || [];

    return (
        <Box>
            <Flex
                bgColor="beets.base.light.alpha.200"
                px={4}
                py={4}
                borderTopLeftRadius="md"
                borderTopRightRadius="md"
                mb={4}
            >
                <Box fontSize="md" fontWeight="medium" color="beets.gray.100" width={135}>
                    Action
                </Box>
                <Box flex={1}>
                    <Text fontSize="md" fontWeight="medium" color="beets.gray.100">
                        Details
                    </Text>
                </Box>
                <Box fontSize="md" fontWeight="medium" color="beets.gray.100" textAlign="right" w={150}>
                    Value
                </Box>
                <Box fontSize="md" fontWeight="medium" color="beets.gray.100" textAlign="right" w={200}>
                    Time
                </Box>
            </Flex>
            {swaps.map((swap) => (
                <Flex px={4} pb={4} mb={4} key={swap.tx} alignItems="center">
                    <Box fontSize="md" fontWeight="medium" width={135}>
                        Swap
                    </Box>
                    <Box flex={1} display="flex" alignItems="center">
                        <TokenAmountPill amount={swap.tokenAmountIn} address={swap.tokenIn} />
                        <Box mx={2}>
                            <ArrowRight />
                        </Box>
                        <TokenAmountPill amount={swap.tokenAmountOut} address={swap.tokenOut} />
                    </Box>
                    <Box fontSize="md" fontWeight="medium" textAlign="right" w={150}>
                        {numberFormatUSDValue(swap.valueUSD)}
                    </Box>
                    <Box justifyContent="flex-end" display="flex" w={200}>
                        <Link display="flex" href={etherscanGetTxUrl(swap.tx)} target="_blank" alignItems="center">
                            <Text mr={1}>
                                {formatDistanceToNow(new Date(swap.timestamp * 1000), {
                                    addSuffix: true,
                                })}
                            </Text>

                            <ExternalLink size={14} />
                        </Link>
                    </Box>
                </Flex>
            ))}
        </Box>
    );
}
