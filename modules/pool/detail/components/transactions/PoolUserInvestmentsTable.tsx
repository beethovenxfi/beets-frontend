import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolEventsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolUserInvestmentsTable() {
    const { pool } = usePool();
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();

    const {
        data: userInvestmentsResponse,
        fetchMore: fetchMoreUserInvestments,
        networkStatus: userInvestmentsStatus,
    } = useGetPoolEventsQuery({
        variables: {
            first: 10,
            chain: networkConfig.chainName,
            poolId: pool.id,
            typeIn: ['ADD', 'REMOVE'],
            userAddress,
        },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isPhantomStable = pool.__typename === 'GqlPoolComposableStable';

    const isFetchingMoreUserInvestments = userInvestmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const userJoinExits = userInvestmentsResponse?.poolEvents || [];
        return userJoinExits.map((action) => ({
            transaction: action,
            type: action.type === 'ADD' ? PoolTransactionType.Join : PoolTransactionType.Exit,
        }));
    }, [isPhantomStable, userInvestmentsResponse?.poolEvents]);

    const handleFetchMoreTransactions = () => {
        fetchMoreUserInvestments({ variables: { skip: transactions.length } });
    };

    return (
        <PaginatedTable
            isInfinite
            isShort={transactions.length < 10}
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
