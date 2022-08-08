import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolSwapsTable() {
    const { pool } = usePool();

    const {
        data: swapsResponse,
        fetchMore: fetchMoreSwaps,
        networkStatus: swapsStatus,
    } = useGetPoolSwapsQuery({
        variables: { where: { poolIdIn: [pool.id] } },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable';
    const isFetchingMoreSwaps = swapsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const swaps = swapsResponse?.swaps || [];

        const swapsOutput = swaps.map((swap) => ({
            transaction: swap,
            type: PoolTransactionType.Swap,
        }));

        const phantomStableSwapsOutput = swaps.map((swap) => {
            const phantomStableToken = swap.poolId.slice(0, 42);
            let type: PoolTransactionType;

            if (swap.tokenOut === phantomStableToken) {
                type = PoolTransactionType.Join;
            } else if (swap.tokenIn === phantomStableToken) {
                type = PoolTransactionType.Exit;
            } else {
                type = PoolTransactionType.Swap;
            }

            return {
                transaction: swap,
                type,
                isPhantomStable,
            };
        });

        return isPhantomStable ? phantomStableSwapsOutput : swapsOutput;
    }, [swapsResponse?.swaps]);

    const handleFetchMoreTransactions = () => {
        fetchMoreSwaps({ variables: { skip: transactions.length } });
    };

    return (
        <PaginatedTable
            isInfinite
            width="full"
            items={transactions}
            loading={false}
            fetchingMore={isFetchingMoreSwaps}
            renderTableHeader={() => <PoolTransactionHeader />}
            renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
            onFetchMore={handleFetchMoreTransactions}
        />
    );
}
