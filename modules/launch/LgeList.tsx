import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { useLgeList } from './useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from './components/LgeListItem';
import { LgeListTop } from './components/LgeListTop';
import { LgeListTableHeader } from './components/LgeListTableHeader';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';

export interface GqlLgeExtended extends GqlLge {
    status: 'active' | 'upcoming' | 'ended';
}

function LgeList() {
    const { lges, loading, error, networkStatus } = useLgeList();

    const now = new Date();

    const lgesExtended: GqlLgeExtended[] = lges.map((lge) => {
        const startDate = new Date(lge.startDate);
        const endDate = new Date(lge.endDate);
        const status = now < startDate ? 'upcoming' : now > endDate ? 'ended' : 'active';
        return {
            ...lge,
            status,
        };
    });

    return (
        <Box>
            {/* <LgeListMobileHeader /> */}
            <LgeListTop />
            <PaginatedTable
                items={lgesExtended}
                loading={loading}
                fetchingMore={networkStatus === NetworkStatus.refetch}
                renderTableHeader={() => <LgeListTableHeader />}
                renderTableRow={(item: GqlLgeExtended, index) => {
                    return (
                        <LgeListItem
                            key={index}
                            lge={item}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === lges.length - 1 ? 0 : 1}
                            bg="box.500"
                        />
                    );
                }}
            />
        </Box>
    );
}

export default LgeList;
