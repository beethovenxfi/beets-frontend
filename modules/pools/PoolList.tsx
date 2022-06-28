import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/modules/pools/components/PoolListItem';
import PoolListTableHeader from '~/modules/pools/components/PoolListTableHeader';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTop } from '~/modules/pools/components/PoolListTop';
import { useUserData } from '~/lib/user/useUserData';
import { useEffect } from 'react';
import { orderBy } from 'lodash';

function PoolList() {
    const { pools, refetch, loading, error, networkStatus, state, count, setPageSize, setPoolIds, showMyInvestments } =
        usePoolList();
    const { poolBalances, userPoolIds, usdBalanceForPool } = useUserData();
    const userPoolIdsStr = userPoolIds.join();

    useEffect(() => {
        if (showMyInvestments) {
            setPoolIds(userPoolIds).catch();
        }
    }, [userPoolIdsStr, showMyInvestments]);

    const poolsToRender = showMyInvestments ? orderBy(pools, (pool) => usdBalanceForPool(pool.id), 'desc') : pools;

    return (
        <Box>
            <PoolListTop />
            <PaginatedTable
                items={poolsToRender}
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
                renderTableRow={(item, index) => {
                    return (
                        <PoolListItem
                            key={index}
                            pool={item}
                            userBalance={`${usdBalanceForPool(item.id)}`}
                            showUserBalance={showMyInvestments}
                        />
                    );
                }}
            />
        </Box>
    );
}

export default PoolList;
