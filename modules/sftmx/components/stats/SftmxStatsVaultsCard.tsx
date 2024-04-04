import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxStatsVaultsHeader';
import SftmxStatsVaultsRow from './SftmxStatsVaultsRow';
import { sortBy } from 'lodash';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import Card from '~/components/card/Card';
import { VStack, Box, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { GqlSftmxStakingVault } from '~/apollo/generated/graphql-codegen-generated';

export function SftmxStatsVaultsCard() {
    const { data, loading: isLoading } = useSftmxGetStakingData();
    const vaults = sortBy(data?.sftmxGetStakingData.vaults, 'unlockTimestamp');

    const skip = 10;
    const [first, setFirst] = useState(0);
    const [vaultsView, setVaultsView] = useState<GqlSftmxStakingVault[] | undefined>();

    useEffect(() => {
        const start = first * skip;
        if (vaults.length - skip - start < 0) {
            setVaultsView(vaults.slice(start));
        } else {
            setVaultsView(vaults.slice(start, start + skip));
        }
    }, [first]);

    useEffect(() => {
        if (!isLoading) {
            setVaultsView(vaults.slice(first, skip));
        }
    }, [isLoading]);

    return (
        <VStack align="flex-start" w="full" h="full">
            <Box h="50px" display={{ base: 'none', lg: 'block' }}></Box>
            <Card shadow="lg" h="full" p="4" title="FTM vaults" w="full">
                {isLoading && (
                    <VStack w="full" h="full" align="center" justify="center">
                        <Spinner size="xl" />
                    </VStack>
                )}
                {vaultsView && !!vaultsView.length && (
                    <PaginatedTable
                        w="full"
                        h="full"
                        items={vaultsView}
                        loading={isLoading || !data}
                        renderTableHeader={() => <SftmxStatsVaultsHeader />}
                        renderTableRow={(item) => <SftmxStatsVaultsRow vault={item} />}
                        hidePageSizeChange
                        count={vaults.length}
                        currentPage={first + 1}
                        onPageChange={(page) => {
                            setFirst(page - 1);
                        }}
                        pageSize={skip}
                    />
                )}
            </Card>
        </VStack>
    );
}
