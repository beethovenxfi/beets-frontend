import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolEventsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolJoinExitsTable() {
    const { pool } = usePool();
    const networkConfig = useNetworkConfig();

    const {
        data: investmentsResponse,
        fetchMore: fetchMoreInvestments,
        networkStatus: investmentsStatus,
    } = useGetPoolEventsQuery({
        variables: { first: 10, chain: networkConfig.chainName, poolId: pool.id, typeIn: ['ADD', 'REMOVE'] },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isFetchingMoreInvestments = investmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const joinExits = investmentsResponse?.poolEvents || [];

        return joinExits.map((action) => ({
            transaction: action,
            type: action.type === 'ADD' ? PoolTransactionType.Join : PoolTransactionType.Exit,
        }));
    }, [investmentsResponse?.poolEvents]);

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
