import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useMemo } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLge } from '~/modules/lge/lib/useLge';
import LgeTransactionHeader from '~/modules/lge/detail/LgeTransactionHeader';
import LgeTransactionItem, { LgeTransactionType } from '~/modules/lge/detail/LgeTransactionItem';

export function LgeSwapsTable() {
    const { lge } = useLge();

    const lgeId = lge?.id || '';

    const {
        data: swapsResponse,
        fetchMore: fetchMoreSwaps,
        networkStatus: swapsStatus,
    } = useGetPoolSwapsQuery({
        variables: { where: { poolIdIn: [lgeId] } },
        pollInterval: 30000,
        notifyOnNetworkStatusChange: true,
    });

    const isFetchingMoreSwaps = swapsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const swaps = swapsResponse?.swaps || [];

        const swapsOutput = swaps.map((swap) => {
            const type =
                swap.tokenIn === lge?.collateralAddress.toLowerCase()
                    ? LgeTransactionType.Buy
                    : LgeTransactionType.Sell;
            return {
                transaction: swap,
                type,
            };
        });

        return swapsOutput;
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
            renderTableHeader={() => <LgeTransactionHeader symbol={lge?.tokenSymbol || ''} />}
            renderTableRow={(item) => (
                <LgeTransactionItem
                    transaction={item}
                    launchTokenSymbol={lge?.tokenSymbol || ''}
                    launchTokenAddress={lge?.tokenAddress.toLowerCase() || ''}
                />
            )}
            onFetchMore={handleFetchMoreTransactions}
        />
    );
}
