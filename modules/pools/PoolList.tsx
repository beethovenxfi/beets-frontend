import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/modules/pools/components/PoolListItem';
import PoolListTableHeader from '~/modules/pools/components/PoolListTableHeader';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTop } from '~/modules/pools/components/PoolListTop';
import { useUserPoolBalances } from '~/lib/user/useUserPoolBalances';
import { useEffect } from 'react';
import { orderBy } from 'lodash';

function PoolList() {
    const { pools, refetch, loading, error, networkStatus, state, count, setPageSize, setPoolIds, showMyInvestments } =
        usePoolList();
    const { poolBalances, userPoolIds, balanceForPool } = useUserPoolBalances();
    const userPoolIdsStr = userPoolIds.join();

    useEffect(() => {
        if (showMyInvestments) {
            setPoolIds(userPoolIds).catch();
        }
    }, [userPoolIdsStr, showMyInvestments]);

    const poolsToRender = showMyInvestments ? orderBy(pools, (pool) => balanceForPool(pool.id), 'desc') : pools;

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
                    const balance = showMyInvestments
                        ? poolBalances.find((balance) => balance.poolId === item.id)?.totalBalance
                        : '0.0';

                    return (
                        <PoolListItem
                            key={index}
                            pool={item}
                            userBalance={balance}
                            showUserBalance={showMyInvestments}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === pools.length - 1 ? 0 : 1}
                            bg="box.500"
                        />
                    );
                }}
            />
        </Box>
    );
}

export default PoolList;
