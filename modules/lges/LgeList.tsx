import { Box, Button, HStack, Link, Alert, Highlight, VStack } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { GqlLgeExtended, useLgeList } from '~/modules/lges/useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from '~/modules/lges/components/LgeListItem';
import { LgeListTop } from '~/modules/lges/components/LgeListTop';
import { LgeListTableHeader } from '~/modules/lges/components/LgeListTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';

function LgeList() {
    const { lges, loading, error, networkStatus } = useLgeList();
    const router = useRouter();
    const [hidden, setHidden] = useState(false);

    return (
        <Box>
            {/* <LgeListMobileHeader /> */}
            <Alert mb="4" variant="left-accent" status="warning" hidden={hidden}>
                <VStack>
                    <Box>
                        <Highlight query={['anyone']} styles={{ fontWeight: 'bold', bg: '#C1C1D1', px: 1, py: 1 }}>
                            Participating in a Liquidity Bootstrapping Pool on Beethoven X is a high-risk endeavor. This
                            is a permissionless service where ANYONE can create an event. Beethoven X is not liable for
                            any losses incurred by using our platform. Please be careful and do your own research before
                            participating in any event.
                        </Highlight>
                    </Box>
                    <HStack mt="8" justifyContent="space-between" w="full">
                        <Link href="https://docs.beets.fi/boundless-opportunity/lbp" isExternal>
                            Read more...
                        </Link>
                        <Button onClick={() => setHidden(true)}>I understand</Button>
                    </HStack>
                </VStack>
            </Alert>
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
                            onClick={() => router.push(`/lge/${item.id}`)}
                        />
                    );
                }}
                isInfinite
                isShort
            />
        </Box>
    );
}

export default LgeList;
