import { useGetTokens } from '~/lib/global/useToken';
import { Box, useDisclosure } from '@chakra-ui/react';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { GqlLbp, GqlPoolLinearFragment, useGetLbpsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { LinearPoolActionsModal } from '~/modules/linear-pools/components/LinearPoolActionsModal';
import { useState } from 'react';
import { LbpTableHeader } from '~/modules/lbp/components/LbpTableHeader';
import { LbpListItem } from '~/modules/lbp/components/LbpListItem';
import { isBefore, parseISO } from 'date-fns';
import { orderBy } from 'lodash';

export function LbpList() {
    const now = new Date();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPool, setSelectedPool] = useState<GqlPoolLinearFragment | null>(null);
    const { data, loading } = useGetLbpsQuery();
    const { getToken } = useGetTokens();
    const lbps = data?.lbps || [];
    const activeAndUpcomingLbps = orderBy(
        lbps.filter((lbp) => isBefore(now, parseISO(lbp.endDate))),
        'startDate',
        'asc',
    );

    /*
    const lges = (data.value || []).filter(lge => {
    return activeTab.value === 'active-upcoming'
      ? isBefore(now, parseISO(lge.endDate))
      : isAfter(now, parseISO(lge.endDate));
  });
     */

    return (
        <Box>
            <PaginatedTable
                items={activeAndUpcomingLbps}
                currentPage={1}
                pageSize={100}
                count={lbps.length}
                loading={loading}
                fetchingMore={false}
                renderTableHeader={() => <LbpTableHeader />}
                renderTableRow={(item: GqlLbp, index) => {
                    return (
                        <LbpListItem
                            key={index}
                            lbp={item}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === lbps.length - 1 ? 0 : 1}
                            bg="box.500"
                        />
                    );
                }}
            />
            <LinearPoolActionsModal isOpen={isOpen} onClose={onClose} pool={selectedPool} />
        </Box>
    );
}
