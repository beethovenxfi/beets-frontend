import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxTableVaultsHeader';
import SftmxStatsVaultsRow from './SftmxTableVaultsRow';
import { VStack, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { GqlSftmxStakingVault } from '~/apollo/generated/graphql-codegen-generated';

interface SftmxTableVaultsProps {
    isLoading: boolean;
    items: GqlSftmxStakingVault[] | undefined;
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    pageSize: number;
}

export function SftmxTableVaults({
    isLoading,
    items,
    count,
    currentPage,
    onPageChange,
    pageSize,
}: SftmxTableVaultsProps) {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <>
            {isLoading && (
                <VStack w="full" h="full" align="center" justify="center">
                    <Spinner size="xl" />
                </VStack>
            )}
            {items && !!items.length && (
                <PaginatedTable
                    w="full"
                    h="full"
                    items={items}
                    loading={isLoading}
                    renderTableHeader={() => <SftmxStatsVaultsHeader />}
                    renderTableRow={(item) => <SftmxStatsVaultsRow vault={item} />}
                    hidePageSizeChange
                    count={count}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    pageSize={pageSize}
                    showLessItems={isMobile}
                />
            )}
        </>
    );
}
