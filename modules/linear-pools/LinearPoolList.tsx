import { useGetTokens } from '~/lib/global/useToken';
import { Box, Link, LinkBox, useDisclosure } from '@chakra-ui/react';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { GqlPoolLinearFragment, useGetLinearPoolsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { LinearPoolListItem } from '~/modules/linear-pools/components/LinearPoolListItem';
import { orderBy } from 'lodash';
import { LinearPoolTableHeader } from '~/modules/linear-pools/components/LinearPoolTableHeader';
import { LinearPoolActionsModal } from '~/modules/linear-pools/components/LinearPoolActionsModal';
import { useState } from 'react';

export function LinearPoolList() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPool, setSelectedPool] = useState<GqlPoolLinearFragment | null>(null);
    const { data, loading } = useGetLinearPoolsQuery({ pollInterval: 30000 });
    const { getToken } = useGetTokens();
    const linearPools = orderBy(data?.pools || [], (pool) => parseFloat(pool.dynamicData.totalLiquidity), 'desc');

    return (
        <Box>
            <PaginatedTable
                items={linearPools}
                currentPage={1}
                pageSize={100}
                count={linearPools.length}
                loading={loading}
                fetchingMore={false}
                renderTableHeader={() => <LinearPoolTableHeader />}
                renderTableRow={(item: GqlPoolLinearFragment, index) => {
                    return (
                        <LinearPoolListItem
                            key={index}
                            pool={item}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === linearPools.length - 1 ? 0 : 1}
                            bg="box.500"
                            tokens={item.tokens.map((token) => ({
                                ...token,
                                logoURI: getToken(token.address)?.logoURI || undefined,
                            }))}
                            onClick={() => {
                                setSelectedPool(item);
                                onOpen();
                            }}
                        />
                    );
                }}
            />
            <LinearPoolActionsModal isOpen={isOpen} onClose={onClose} pool={selectedPool} />
        </Box>
    );
}
