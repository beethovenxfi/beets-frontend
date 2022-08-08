import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolUserJoinExitsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolUserInvestmentsTable() {
    const { pool } = usePool();

    const {
        data: userInvestmentsResponse,
        fetchMore: fetchMoreUserInvestments,
        networkStatus: userInvestmentsStatus,
    } = useGetPoolUserJoinExitsQuery({
        variables: { poolId: pool.id },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable';

    const isFetchingMoreUserInvestments = userInvestmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const userJoinExits = userInvestmentsResponse?.joinExits || [];
        return userJoinExits.map((action) => ({
            transaction: action,
            type: action.type === 'Join' ? PoolTransactionType.Join : PoolTransactionType.Exit,
        }));
    }, [isPhantomStable, userInvestmentsResponse?.joinExits]);

    const handleFetchMoreTransactions = () => {
        fetchMoreUserInvestments({ variables: { skip: transactions.length } });
    };

    return (
        <PaginatedTable
            isInfinite
            isShort={transactions.length < 11}
            width="full"
            items={transactions}
            loading={false}
            fetchingMore={isFetchingMoreUserInvestments}
            renderTableHeader={() => <PoolTransactionHeader />}
            renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
            onFetchMore={handleFetchMoreTransactions}
        />
    );
}
