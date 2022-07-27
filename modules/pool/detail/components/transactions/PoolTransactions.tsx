import { usePool } from '~/modules/pool/lib/usePool';
import { Box, TabList, Tabs, HStack, VStack } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import {
    useGetPoolJoinExitsQuery,
    useGetPoolSwapsQuery,
    useGetPoolUserJoinExitsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionRow';
import { useMemo, useState } from 'react';
import PoolTransactionHeader from './PoolTransactionsHeader';
import { NetworkStatus } from '@apollo/client';
import { PoolDetailAboutThisPool } from '~/modules/pool/detail/components/PoolDetailAboutThisPool';

type Props = {};

export function PoolTransactions({ ...rest }: Props & BoxProps) {
    const [activeTab, setActiveTab] = useState(0);
    const { pool } = usePool();
    const {
        data: investmentsResponse,
        fetchMore: fetchMoreInvestments,
        networkStatus: investmentsStatus,
    } = useGetPoolJoinExitsQuery({
        variables: { poolId: pool.id },
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

    const {
        data: userInvestmentsResponse,
        fetchMore: fetchMoreUserInvestments,
        networkStatus: userInvestmentsStatus,
    } = useGetPoolUserJoinExitsQuery({
        variables: { poolId: pool.id },
        pollInterval: 7500,
        notifyOnNetworkStatusChange: true,
    });

    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable';

    const isFetchingMoreSwaps = swapsStatus === NetworkStatus.fetchMore;
    const isFetchingMoreInvestments = investmentsStatus === NetworkStatus.fetchMore;
    const isFetchingMoreUserInvestments = userInvestmentsStatus === NetworkStatus.fetchMore;

    const transactions = useMemo(() => {
        const swaps = swapsResponse?.swaps || [];
        const joinExits = investmentsResponse?.joinExits || [];
        const userJoinExits = userInvestmentsResponse?.joinExits || [];

        const joinExitsOutput = joinExits.map((action) => ({
            transaction: action,
            type: action.type === 'Join' ? PoolTransactionType.Join : PoolTransactionType.Exit,
        }));

        const swapsOutput = swaps.map((swap) => ({
            transaction: swap,
            type: PoolTransactionType.Swap,
        }));

        const userJoinExitsOutput = userJoinExits.map((action) => ({
            transaction: action,
            type: action.type === 'Join' ? PoolTransactionType.Join : PoolTransactionType.Exit,
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

        if (activeTab === 1) {
            return isPhantomStable ? phantomStableSwapsOutput : joinExitsOutput;
        } else if (activeTab === 2) {
            return isPhantomStable ? userJoinExitsOutput : swapsOutput;
        } else if (activeTab === 3) {
            return isPhantomStable ? [] : userJoinExitsOutput;
        } else {
            return [];
        }
    }, [
        activeTab,
        isPhantomStable,
        investmentsResponse?.joinExits,
        swapsResponse?.swaps,
        userInvestmentsResponse?.joinExits,
    ]);

    const handleFetchMoreTransactions = () => {
        if (activeTab === 2 && !isPhantomStable) {
            console.log('swaps');
            fetchMoreSwaps({ variables: { skip: transactions.length } });
        } else if (activeTab === 3 || (activeTab === 2 && isPhantomStable)) {
            console.log('my investments');
            fetchMoreUserInvestments({ variables: { skip: transactions.length } });
        } else {
            console.log('investments');
            fetchMoreInvestments({ variables: { skip: transactions.length } });
        }
    };

    return (
        <Box width="full" {...rest}>
            <Tabs variant="soft-rounded" onChange={setActiveTab}>
                <VStack width="full" alignItems="flex-start">
                    <TabList mb="2">
                        <HStack>
                            <BeetsTab>About this pool</BeetsTab>
                            {/*<BeetsTab>Top holders</BeetsTab>*/}
                            <BeetsTab>{isPhantomStable ? 'Transactions' : 'Investments'}</BeetsTab>
                            {!isPhantomStable && <BeetsTab>Swaps</BeetsTab>}
                            <BeetsTab>My {isPhantomStable ? 'transactions' : 'investments'}</BeetsTab>
                        </HStack>
                    </TabList>
                    {activeTab === 0 ? (
                        <PoolDetailAboutThisPool />
                    ) : (
                        <PaginatedTable
                            isInfinite
                            width="full"
                            items={transactions}
                            loading={false}
                            fetchingMore={
                                isFetchingMoreSwaps || isFetchingMoreInvestments || isFetchingMoreUserInvestments
                            }
                            renderTableHeader={() => <PoolTransactionHeader />}
                            renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
                            onFetchMore={handleFetchMoreTransactions}
                        />
                    )}
                </VStack>
            </Tabs>
        </Box>
    );
}
