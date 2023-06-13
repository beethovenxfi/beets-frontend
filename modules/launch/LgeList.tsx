import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { GqlLgeExtended, useLgeList } from '~/modules/launch/useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from '~/modules/launch/components/LgeListItem';
import { LgeListTop } from '~/modules/launch/components/LgeListTop';
import { LgeListTableHeader } from '~/modules/launch/components/LgeListTableHeader';

function LgeList() {
    const { lgesExtended, loading, error, networkStatus } = useLgeList();

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
                            borderBottomWidth={index === lgesExtended.length - 1 ? 0 : 1}
                            bg="box.500"
                        />
                    );
                }}
            />
        </Box>
    );
}

export default LgeList;
