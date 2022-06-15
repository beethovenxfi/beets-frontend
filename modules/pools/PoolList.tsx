import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/modules/pools/components/PoolListItem';
import PoolListTableHeader from '~/modules/pools/components/PoolListTableHeader';
import { debounce } from 'lodash';
import { useBoolean } from '@chakra-ui/hooks';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTop } from '~/modules/pools/components/PoolListTop';

function PoolList() {
    const { pools, refetch, loading, error, networkStatus, state, count, setPageSize } = usePoolList();
    const [isSearching, { on, off }] = useBoolean();

    const submitSearch = debounce(async () => {
        //await refetch({...state, });
        off();
    }, 250);

    return (
        <Box>
            <PoolListTop />
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
                renderTableHeader={() => <PoolListTableHeader />}
                renderTableRow={(item, index) => (
                    <PoolListItem
                        key={index}
                        pool={item}
                        borderBottomColor="beets.base.800"
                        borderBottomWidth={index === pools.length - 1 ? 0 : 1}
                        bg="rgba(255,255,255,0.05)"
                    />
                )}
            />
        </Box>
    );
}

export default PoolList;
