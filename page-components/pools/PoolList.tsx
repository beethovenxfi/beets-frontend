import { Box, Button, Container, Flex, Select, Spinner } from '@chakra-ui/react';
import { GqlPoolFilterType, GqlPoolOrderBy, GqlPoolOrderDirection } from '~/apollo/generated/graphql-codegen-generated';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/page-components/pools/PoolListItem';

function PoolList() {
    const { pools, refetch, loading, error, fetchMore, networkStatus, state } = usePoolList();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="7xl">
            <Flex mb={4}>
                <Box flex={2.5} mr={2}>
                    <Select
                        placeholder="Order by"
                        color={'white'}
                        onChange={(e) => {
                            state.orderBy = e.target.value ? (e.target.value as GqlPoolOrderBy) : 'totalLiquidity';
                            refetch();
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
                            state.orderDirection = e.target.value ? (e.target.value as GqlPoolOrderDirection) : 'desc';
                            refetch();
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
                        state.where = {
                            ...state.where,
                            poolTypeIn: e.target.value
                                ? [e.target.value as GqlPoolFilterType]
                                : ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
                        };
                        refetch();
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
                pools.map((pool, index) => <PoolListItem key={index} pool={pool} />)
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
