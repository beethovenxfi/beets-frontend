import { Box, Flex, Text } from '@chakra-ui/react';
import { usePoolList } from '../usePoolList';
import PoolListSortLink from '~/modules/pools/components/PoolListSortLink';

function PoolListSortableHeader() {
    const { state, changeSort } = usePoolList();

    return (
        <Flex px={4} py={4} cursor="pointer" borderRadius={4} alignItems={'center'} bgColor="#100C3A">
            <Box flex={1}>
                <Text fontSize="lg" fontWeight="medium" color="#C3C5E9">
                    Pool details
                </Text>
            </Box>
            <Box w={200}>
                <PoolListSortLink
                    title="TVL"
                    orderDirection={state.orderBy === 'totalLiquidity' ? state.orderDirection : null}
                    onClick={() => changeSort('totalLiquidity')}
                />
            </Box>
            <Box w={200} textAlign={'center'}>
                <PoolListSortLink
                    title="Volume (24h)"
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
