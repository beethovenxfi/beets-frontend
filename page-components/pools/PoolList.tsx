import { Box, Button, Container, Flex, Heading, Link, Select, Spinner, Text } from '@chakra-ui/react';
import { GqlPoolFilterType, GqlPoolOrderBy, GqlPoolOrderDirection } from '~/apollo/generated/graphql-codegen-generated';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/page-components/pools/PoolListItem';
import TokenAvatarSet from '~/components/token-avatar/TokenAvatarSet';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { ArrowUp } from 'react-feather';
import PoolListSortLink from '~/page-components/pools/PoolListSortLink';

function PoolList() {
    const { pools, refetch, loading, error, fetchMore, networkStatus, state, changeSort } = usePoolList();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="7xl">
            <Box mb={4}>
                <Text>Pool type</Text>
                <Select
                    placeholder="All"
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

            <Flex color={'white'} bg={'black'} mb={2} p={4} cursor="pointer" borderRadius={4} alignItems={'center'}>
                <Box flex={1}></Box>
                <Box w={200}>
                    <PoolListSortLink
                        title="Pool value"
                        orderDirection={state.orderBy === 'totalLiquidity' ? state.orderDirection : null}
                        onClick={() => changeSort('totalLiquidity')}
                    />
                </Box>
                <Box w={200} textAlign={'center'}>
                    <PoolListSortLink
                        title="Volume"
                        orderDirection={state.orderBy === 'volume24h' ? state.orderDirection : null}
                        onClick={() => changeSort('volume24h')}
                    />
                </Box>
                <Box w={100} textAlign={'center'}>
                    <PoolListSortLink
                        title="APR"
                        orderDirection={state.orderBy === 'apr' ? state.orderDirection : null}
                        onClick={() => changeSort('apr')}
                    />
                </Box>
            </Flex>
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
