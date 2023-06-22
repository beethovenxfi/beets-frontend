import { Text } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { GqlLgeExtended, useLgeList } from '~/modules/lges/useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from '~/modules/lges/components/LgeListItem';
import { LgeListTop } from '~/modules/lges/components/LgeListTop';
import { LgeListTableHeader } from '~/modules/lges/components/LgeListTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LgeWarning } from './components/LgeWarning';
import { LgeListMobileHeader } from '~/modules/lges/components/LgeListMobileHeader';

function LgeList() {
    const { lges, loading, networkStatus } = useLgeList();
    const router = useRouter();
    const [hidden, setHidden] = useState(false);

    return (
        <>
            <LgeWarning hidden={hidden} setHidden={() => setHidden(true)}>
                <Text>
                    Participating in a Liquidity Bootstrapping Pool on Beethoven X is a high-risk endeavor. This is a
                    permissionless service where <span style={{ fontWeight: 'bold' }}>ANYONE</span> can create an event.
                    Beethoven X is not liable for any losses incurred by using our platform. Please be careful and do
                    your own research before participating in any event.
                </Text>
            </LgeWarning>
            <LgeListMobileHeader />
            <LgeListTop />
            <PaginatedTable
                items={lges}
                loading={loading}
                renderTableHeader={() => <LgeListTableHeader />}
                renderTableRow={(item: GqlLgeExtended, index) => {
                    return (
                        <LgeListItem
                            key={index}
                            lge={item}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === lges.length - 1 ? 0 : 1}
                            bg="box.500"
                            onClick={() => router.push(`/lge/${item.id}`)}
                        />
                    );
                }}
                isInfinite
                isShort
            />
        </>
    );
}

export default LgeList;
