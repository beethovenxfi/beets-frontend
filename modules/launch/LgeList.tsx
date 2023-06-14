import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { GqlLgeExtended, useLgeList } from '~/modules/launch/useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from '~/modules/launch/components/LgeListItem';
import { LgeListTop } from '~/modules/launch/components/LgeListTop';
import { LgeListTableHeader } from '~/modules/launch/components/LgeListTableHeader';
import { useRouter } from 'next/router';

function LgeList() {
    const { lges, loading, error, networkStatus } = useLgeList();
    const router = useRouter();

    return (
        <Box>
            {/* <LgeListMobileHeader /> */}
            <LgeListTop />
            <PaginatedTable
                items={lges}
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
                            onClick={() => router.push(`/launch/${item.id}`)}
                        />
                    );
                }}
            />
        </Box>
    );
}

export default LgeList;
