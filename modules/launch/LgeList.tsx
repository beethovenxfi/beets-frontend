import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { useLgeList } from './useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from './components/LgeListItem';
import { LgeListTop } from './components/LgeListTop';
import { LgeListTableHeader } from './components/LgeListTableHeader';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';

function LgeList() {
    const { lges, loading, error, networkStatus } = useLgeList();

    return (
        <Box>
            {/* <LgeListMobileHeader /> */}
            <LgeListTop />
            <PaginatedTable
                items={lges}
                loading={loading}
                fetchingMore={networkStatus === NetworkStatus.refetch}
                renderTableHeader={() => <LgeListTableHeader />}
                renderTableRow={(item: GqlLge, index) => {
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
