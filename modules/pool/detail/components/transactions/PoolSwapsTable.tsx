import { PaginatedTable } from '~/components/table/PaginatedTable';
import { GqlPoolSwapEventV3, useGetPoolEventsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolSwapsTable() {
    const { pool } = usePool();
    const networkConfig = useNetworkConfig();

    const {
        data: swapsResponse,
        fetchMore: fetchMoreSwaps,
        networkStatus: swapsStatus,
    } = useGetPoolEventsQuery({
        variables: { first: 10, chain: networkConfig.chainName, poolId: pool.id, typeIn: ['SWAP'] },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isPhantomStable = pool.__typename === 'GqlPoolComposableStable';
    const isFetchingMoreSwaps = swapsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const swaps = swapsResponse?.poolEvents || [];

        const swapsOutput = swaps
            .filter((swap) => swap.type === 'SWAP')
            .map((swap) => ({
                transaction: swap,
                type: PoolTransactionType.Swap,
            }));

        const phantomStableSwapsOutput = swaps
            .filter((swap) => swap.type === 'SWAP')
            .map((swap) => {
                const phantomStableToken = swap.poolId.slice(0, 42);
                let type: PoolTransactionType;

                if ((swap as GqlPoolSwapEventV3).tokenOut.address === phantomStableToken) {
                    type = PoolTransactionType.Join;
                } else if ((swap as GqlPoolSwapEventV3).tokenIn.address === phantomStableToken) {
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
    }, [swapsResponse?.poolEvents]);

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
