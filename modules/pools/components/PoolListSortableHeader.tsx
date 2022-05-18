import { Box, Flex } from '@chakra-ui/react';
import { usePoolList } from '../usePoolList';
import PoolListSortLink from '~/modules/pools/components/PoolListSortLink';

function PoolListSortableHeader() {
    const { state, changeSort } = usePoolList();

    return (
        <Flex bg={'black'} mb={2} p={4} cursor="pointer" borderRadius={4} alignItems={'center'}>
            <Box flex={1} />
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
    );
}

export default PoolListSortableHeader;
