import { usePool } from '~/modules/pool/lib/usePool';
import { useGetPoolJoinExitsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { ExternalLink, Minus, Plus } from 'react-feather';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { etherscanGetTxUrl } from '~/lib/util/etherscan';
import { formatDistanceToNow } from 'date-fns';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { useEffect, useState } from 'react';
import BeetsButton from '~/components/button/Button';
import { NetworkStatus } from '@apollo/client';

const PAGE_SIZE = 10;

export function PoolDetailInvestments() {
    const [skip, setSkip] = useState(0);
    const { pool } = usePool();
    const { data, fetchMore, networkStatus, refetch } = useGetPoolJoinExitsQuery({
        variables: { poolId: pool.id, skip },
        pollInterval: 7500,
        notifyOnNetworkStatusChange: true,
    });
    const joinExits = data?.joinExits || [];

    useEffect(() => {
        refetch();
    });

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
                <Box flex={1} fontSize="md" fontWeight="medium" color="beets.gray.100">
                    Details
                </Box>
                <Box fontSize="md" fontWeight="medium" color="beets.gray.100" textAlign="right" w={150}>
                    Value
                </Box>
                <Box fontSize="md" fontWeight="medium" color="beets.gray.100" textAlign="right" w={200}>
                    Time
                </Box>
            </Flex>
            {joinExits.map((joinExit) => (
                <Flex px={4} pb={4} mb={2} key={joinExit.tx} alignItems="center">
                    <Flex alignItems="center" width={135}>
                        <Box color={joinExit.type === 'Join' ? 'beets.green.400' : 'beets.red.300'}>
                            {joinExit.type === 'Join' ? <Plus size="20" /> : <Minus size="20" />}
                        </Box>

                        <Text ml={1}>{joinExit.type === 'Join' ? 'Invest' : 'Withdraw'}</Text>
                    </Flex>
                    <Box flex={1} display="flex" alignItems="center" flexWrap={'wrap'}>
                        {joinExit.amounts
                            .filter((tokenAmount) => tokenAmount.amount !== '0')
                            .map((tokenAmount, index) => (
                                <TokenAmountPill
                                    key={index}
                                    amount={tokenAmount.amount}
                                    address={tokenAmount.address}
                                    mb={2}
                                    mr={2}
                                />
                            ))}
                    </Box>
                    <Box fontSize="md" fontWeight="medium" textAlign="right" w={150}>
                        {numberFormatUSDValue(joinExit.valueUSD)}
                    </Box>
                    <Box justifyContent="flex-end" display="flex" w={200}>
                        <Link display="flex" href={etherscanGetTxUrl(joinExit.tx)} target="_blank" alignItems="center">
                            <Text mr={1}>
                                {formatDistanceToNow(new Date(joinExit.timestamp * 1000), {
                                    addSuffix: true,
                                })}
                            </Text>

                            <ExternalLink size={14} />
                        </Link>
                    </Box>
                </Flex>
            ))}
            <Flex p={4} pt={0}>
                <BeetsButton
                    isLoading={networkStatus === NetworkStatus.fetchMore}
                    onClick={() => {
                        fetchMore({ variables: { skip: joinExits.length } }).catch();
                    }}
                    flex={1}
                >
                    Load more
                </BeetsButton>
            </Flex>
        </Box>
    );
}
