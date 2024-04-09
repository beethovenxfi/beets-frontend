import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxTableVaultsHeader';
import SftmxStatsVaultsRow from './SftmxTableVaultsRow';
import { sortBy } from 'lodash';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import Card from '~/components/card/Card';
import { VStack, Box, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
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
                />
            )}
        </>
    );
}
