import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxStatsVaultsHeader';
import SftmxStatsVaultsRow from './SftmxStatsVaultsRow';
import { sortBy } from 'lodash';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import Card from '~/components/card/Card';
import { VStack, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export function SftmxStatsVaultsCard() {
    const { data, loading: isLoading } = useSftmxGetStakingData();
    const vaults = sortBy(data?.sftmxGetStakingData.vaults, 'unlockTimestamp');

    const skip = 10;
    const [first, setFirst] = useState(0);
    const [vaultsView, setVaultsView] = useState(vaults.slice(first, skip));

    useEffect(() => {
        const start = first * skip;
        if (vaults.length - skip - start < 0) {
            setVaultsView(vaults.slice(start));
        } else {
            setVaultsView(vaults.slice(start, start + skip));
        }
    }, [first]);

    return (
        <VStack align="flex-start" w="full" h="full">
            <Box h="50px"></Box>
            <Card shadow="lg" h="full" p="4" title="FTM vaults">
                <PaginatedTable
                    w="full"
                    h="full"
                    items={vaultsView}
                    loading={isLoading}
                    renderTableHeader={() => <SftmxStatsVaultsHeader />}
                    renderTableRow={(item) => <SftmxStatsVaultsRow vault={item} />}
                    noResultLabel="No vaults found!"
                    hidePageSizeChange
                    count={vaults.length}
                    currentPage={first + 1}
                    onPageChange={(page) => {
                        setFirst(page - 1);
                    }}
                    pageSize={skip}
                />
            </Card>
        </VStack>
    );
}
