import { usePool } from '~/modules/pool/lib/usePool';
import { Box, TabList, Tabs, HStack, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { useGetPoolJoinExitsQuery, useGetPoolSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo, useState } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';

type Props = {};

export function PoolTransactions({ ...rest }: Props & BoxProps) {
    const [skip, setSkip] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const { pool } = usePool();
    const {
        data: investmentsResponse,
        fetchMore: fetchMoreInvestments,
        networkStatus: investmentsStatus,
    } = useGetPoolJoinExitsQuery({
        variables: { poolId: pool.id, skip },
        pollInterval: 7500,
        notifyOnNetworkStatusChange: true,
    });

    const {
        data: swapsResponse,
        fetchMore: fetchMoreSwaps,
        networkStatus: swapsStatus,
    } = useGetPoolSwapsQuery({
        variables: { where: { poolIdIn: [pool.id] } },
        pollInterval: 7500,
        notifyOnNetworkStatusChange: true,
    });

    const isFetchingMoreSwaps = swapsStatus === NetworkStatus.fetchMore;
    const isFetchingMoreInvestments = investmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const swaps = swapsResponse?.swaps || [];
        const joinExits = investmentsResponse?.joinExits || [];

        if (activeTab === 0) {
            return joinExits.map((action) => ({
                transaction: action,
                type: action.type === 'Join' ? PoolTransactionType.Join : PoolTransactionType.Exit,
            }));
        } else {
            return swaps.map((swap) => ({
                transaction: swap,
                type: PoolTransactionType.Swap,
            }));
        }
    }, [activeTab, investmentsResponse?.joinExits, swapsResponse?.swaps]);

    const handleTabChanged = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const handleFetchMoreTransactions = () => {
        if (activeTab === 1) {
            fetchMoreSwaps({ variables: { skip: transactions.length } });
        } else {
            fetchMoreInvestments({ variables: { skip: transactions.length } });
        }
    };

    console.log({
        isFetchingMoreInvestments,
        isFetchingMoreSwaps
    })
    return (
        <Box width="full" {...rest}>
            <Tabs variant="soft-rounded" onChange={handleTabChanged}>
                <VStack width="full" alignItems="flex-start">
                    <TabList>
                        <HStack>
                            <BeetsTab>Investments</BeetsTab>
                            <BeetsTab>Swaps</BeetsTab>
                            <BeetsTab>My investments</BeetsTab>
                        </HStack>
                    </TabList>

                    <PaginatedTable
                        isInfinite
                        width="full"
                        items={transactions}
                        pageSize={20}
                        loading={false}
                        fetchingMore={isFetchingMoreSwaps || isFetchingMoreInvestments}
                        renderTableHeader={() => <PoolTransactionHeader />}
                        renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
                        onFetchMore={handleFetchMoreTransactions}
                    />
                </VStack>
            </Tabs>
        </Box>
    );
}
