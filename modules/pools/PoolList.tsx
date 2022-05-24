import { Box, Flex, IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/modules/pools/components/PoolListItem';
import { Search } from 'react-feather';
import PoolListSortableHeader from '~/modules/pools/components/PoolListSortableHeader';
import { debounce } from 'lodash';
import { useBoolean } from '@chakra-ui/hooks';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTabs } from '~/modules/pools/components/PoolListTabs';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';

function PoolList() {
    const { pools, refetch, loading, error, networkStatus, state, count, setPageSize } = usePoolList();
    const [isSearching, { on, off }] = useBoolean();

    const submitSearch = debounce(async () => {
        //await refetch({...state, });
        off();
    }, 250);

    return (
        <Box p={4}>
            <Flex pb={4}>
                <Box flex={1}>
                    <PoolListTabs />
                </Box>
                <Box>
                    <PoolListSearch />
                </Box>
            </Flex>

            <PaginatedTable
                items={pools}
                currentPage={state.skip / state.first + 1}
                pageSize={state.first}
                count={count || 0}
                onPageChange={(page) => {
                    refetch({ ...state, skip: state.first * (page - 1) });
                }}
                loading={loading}
                fetchingMore={networkStatus === NetworkStatus.refetch}
                onPageSizeChange={setPageSize}
                renderTableHeader={() => <PoolListSortableHeader />}
                renderTableRow={(item, index) => (
                    <PoolListItem
                        key={index}
                        pool={item}
                        borderBottomColor="beets.base.800"
                        borderBottomWidth={index === pools.length - 1 ? 0 : 1}
                    />
                )}
            />
        </Box>
    );
}

export default PoolList;
