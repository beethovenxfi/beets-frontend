import { usePool } from '~/modules/pool/lib/usePool';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, HStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BoxProps, Flex, Text } from '@chakra-ui/layout';
import { PoolDetailSwaps } from '~/modules/pool/detail/components/PoolDetailSwaps';
import { PoolDetailInvestments } from '~/modules/pool/detail/components/PoolDetailInvestments';
import BeetsTab from '~/components/tabs/BeetsTab';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import {
    GqlPoolJoinExit,
    GqlPoolSwap,
    useGetPoolJoinExitsQuery,
    useGetPoolSwapsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import PoolTransactionItem, { PoolTransactionType } from './PoolTransactionItem';
import { useMemo, useState } from 'react';

function PoolTransactionHeader() {
    return (
        <Flex
            px="4"
            py="3"
            cursor="pointer"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems={'center'}
            bgColor="rgba(255,255,255,0.08)"
            borderBottom="2px"
            borderColor="beets.base.500"
        >
            <Box width="200px">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Action
                </Text>
            </Box>
            <Box flex={1} textAlign="left">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Details
                </Text>
            </Box>
            <Box width="200px" textAlign="right">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Value
                </Text>
            </Box>
            <Box width="200px" textAlign="right">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Time
                </Text>
            </Box>
        </Flex>
    );
}

type Props = {};

export function PoolDetailTransactions({ ...rest }: Props & BoxProps) {
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

    return (
        <Box {...rest}>
            <Tabs variant="soft-rounded" onChange={handleTabChanged}>
                <TabList>
                    <HStack>
                        <BeetsTab>Investments</BeetsTab>
                        <BeetsTab>Swaps</BeetsTab>
                        <BeetsTab>My investments</BeetsTab>
                    </HStack>
                </TabList>
                <BeetsBox mt={4}>
                    <PaginatedTable
                        items={transactions}
                        // currentPage={state.skip / state.first + 1}
                        pageSize={20}
                        // count={count || 0}
                        onPageChange={(page) => {
                            // refetch({ ...state, skip: state.first * (page - 1) });
                        }}
                        currentPage={0}
                        onPageSizeChange={() => {}}
                        count={transactions.length}
                        loading={false}
                        fetchingMore={false}
                        // onPageSizeChange={setPageSize}
                        renderTableHeader={() => <PoolTransactionHeader />}
                        renderTableRow={(item, index) => <PoolTransactionItem transaction={item} />}
                    />
                </BeetsBox>
            </Tabs>
        </Box>
    );
}
