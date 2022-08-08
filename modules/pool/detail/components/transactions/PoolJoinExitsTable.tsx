import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolJoinExitsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolJoinExitsTable() {
    const { pool } = usePool();
    const {
        data: investmentsResponse,
        fetchMore: fetchMoreInvestments,
        networkStatus: investmentsStatus,
    } = useGetPoolJoinExitsQuery({
        variables: { poolId: pool.id },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isFetchingMoreInvestments = investmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const joinExits = investmentsResponse?.joinExits || [];

        return joinExits.map((action) => ({
            transaction: action,
            type: action.type === 'Join' ? PoolTransactionType.Join : PoolTransactionType.Exit,
        }));
    }, [investmentsResponse?.joinExits]);

    const handleFetchMoreTransactions = () => {
        fetchMoreInvestments({ variables: { skip: transactions.length } });
    };

    return (
        <PaginatedTable
            isInfinite
            width="full"
            items={transactions}
            loading={false}
            fetchingMore={isFetchingMoreInvestments}
            renderTableHeader={() => <PoolTransactionHeader />}
            renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
            onFetchMore={handleFetchMoreTransactions}
        />
    );
}
