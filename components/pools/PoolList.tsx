import { Box, Button, Container, Flex, Heading, Select, Spinner, Stack } from '@chakra-ui/react';
import {
    GqlPoolFilterType,
    GqlPoolOrderBy,
    GqlPoolOrderDirection,
    useGetPoolsQuery,
} from '../../apollo/generated/graphql-codegen-generated';
import { NetworkStatus, useReactiveVar } from '@apollo/client';
import { poolListStateVar } from './poolListState';
import Link from 'next/link';

function PoolList() {
    const poolListState = useReactiveVar(poolListStateVar);
    const { data, loading, error, fetchMore, networkStatus, refetch } = useGetPoolsQuery({
        notifyOnNetworkStatusChange: true,
        variables: poolListState,
    });
    const pools = data?.poolGetPools;

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="7xl">
            <Flex mb={4}>
                <Box flex={2.5} mr={2}>
                    <Select
                        placeholder="Order by"
                        color={'white'}
                        onChange={(e) => {
                            poolListState.orderBy = e.target.value
                                ? (e.target.value as GqlPoolOrderBy)
                                : 'totalLiquidity';
                            refetch(poolListState);
                        }}
                    >
                        <option value="totalLiquidity">Total Liquidity</option>
                        <option value="fees24h">Fees 24h</option>
                        <option value="volume24h">Volume 24h</option>
                    </Select>
                </Box>
                <Box flex={1}>
                    <Select
                        placeholder="Order"
                        color={'white'}
                        onChange={(e) => {
                            poolListState.orderDirection = e.target.value
                                ? (e.target.value as GqlPoolOrderDirection)
                                : 'desc';
                            refetch(poolListState);
                        }}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </Select>
                </Box>
            </Flex>
            <Box mb={4}>
                <Select
                    placeholder="Pool type"
                    color={'white'}
                    onChange={(e) => {
                        poolListState.where = {
                            ...poolListState.where,
                            poolTypeIn: e.target.value
                                ? [e.target.value as GqlPoolFilterType]
                                : ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
                        };
                        refetch(poolListState);
                    }}
                >
                    <option value="WEIGHTED">Weighted</option>
                    <option value="STABLE">Stable</option>
                    <option value="PHANTOM_STABLE">Stable Phantom</option>
                </Select>
            </Box>

            {networkStatus === NetworkStatus.refetch ? (
                <Flex justifyContent={'center'} my={4}>
                    <Spinner size="xl" color={'white'} />
                </Flex>
            ) : pools ? (
                pools.map((pool, index) => (
                    <Link key={index} href={`/pool/${pool.id}`}>
                        <Box color={'white'} bg={'black'} mb={2} px={2} py={2}>
                            <Heading mb={2} size={'md'}>
                                {pool.name}
                            </Heading>
                            liquidity: {pool.dynamicData.totalLiquidity}
                            <br />
                            fees24h: {pool.dynamicData.fees24h}
                            <br />
                            volume24h: {pool.dynamicData.volume24h}
                            <br />
                            apr: {(parseFloat(pool.dynamicData.apr.total) * 100).toFixed(2)}%
                        </Box>
                    </Link>
                ))
            ) : null}

            <Button
                colorScheme="blue"
                isLoading={loading || networkStatus === NetworkStatus.fetchMore}
                onClick={async () => fetchMore({ variables: { skip: pools?.length } })}
                w={`100%`}
                mt={4}
            >
                Load More
            </Button>
        </Container>
    );
}

export default PoolList;
