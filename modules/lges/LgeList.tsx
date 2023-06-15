import { Box, Button, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { GqlLgeExtended, useLgeList } from '~/modules/lges/useLgeList';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { LgeListItem } from '~/modules/lges/components/LgeListItem';
import { LgeListTop } from '~/modules/lges/components/LgeListTop';
import { LgeListTableHeader } from '~/modules/lges/components/LgeListTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Card from '~/components/card/Card';
import { AlertTriangle } from 'react-feather';

function LgeList() {
    const { lges, loading, error, networkStatus } = useLgeList();
    const router = useRouter();
    const [hidden, setHidden] = useState(false);

    return (
        <Box>
            {/* <LgeListMobileHeader /> */}
            <Box hidden={hidden}>
                <Card p="4" mb="4" bg="orange.200" color="black">
                    <VStack>
                        <HStack alignSelf="flex-start">
                            <AlertTriangle />
                            <Heading>Warning</Heading>
                            <AlertTriangle />
                        </HStack>
                        <Text>
                            Participating in a Liquidity Bootstrapping Pool on Beethoven X is a high-risk endeavor. This
                            is a permissionless service where <span style={{ fontWeight: 'bold' }}>ANYONE</span> can
                            create an event. Beethoven X is not liable for any losses incurred by using our platform.
                            Please be careful and do your own research before participating in any event.
                        </Text>
                        <HStack pt="4" justifyContent="space-between" w="full">
                            <Link href="https://docs.beets.fi/boundless-opportunity/lbp" isExternal>
                                <Button color="black" border="1px">
                                    Read more...
                                </Button>
                            </Link>
                            <Button onClick={() => setHidden(true)} border="1px">
                                I understand
                            </Button>
                        </HStack>
                    </VStack>
                </Card>
            </Box>
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
