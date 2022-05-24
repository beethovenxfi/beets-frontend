import { Box, Flex, Text } from '@chakra-ui/react';
import { usePoolList } from '../usePoolList';
import PoolListSortLink from '~/modules/pools/components/PoolListSortLink';

function PoolListTableHeader() {
    const { state, changeSort } = usePoolList();

    return (
        <Flex
            px={4}
            py={4}
            cursor="pointer"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems={'center'}
            bgColor="beets.base.800"
        >
            <Box flex={1}>
                <Text fontSize="lg" fontWeight="medium" color="beets.gray.100">
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

export default PoolListTableHeader;
