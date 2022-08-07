import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { usePoolList } from '../usePoolList';
import PoolListSortLink from '~/modules/pools/components/PoolListSortLink';
import { InfoButton } from '~/components/info-button/InfoButton';

export function PoolListTableHeader() {
    const { state, changeSort, showMyInvestments } = usePoolList();

    return (
        <>
            <Grid
                pl="4"
                py="3"
                borderTopLeftRadius="md"
                borderTopRightRadius="md"
                alignItems={'center'}
                bgColor="rgba(255,255,255,0.08)"
                borderBottom="2px"
                borderColor="beets.base.500"
                mb={{ base: '4', lg: '0' }}
                templateColumns={
                    showMyInvestments
                        ? { base: '1fr 150px 200px 200px', xl: '1fr 150px 200px 200px 200px' }
                        : '1fr 200px 200px 200px'
                }
                gap="0"
                display={{ base: 'none', lg: 'grid' }}
            >
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Pool details
                    </Text>
                </GridItem>
                {showMyInvestments && (
                    <GridItem textAlign="right">
                        <Flex justifyContent="flex-end" color="beets.base.100">
                            <Text fontSize="md" fontWeight="semibold">
                                My balance
                            </Text>
                            <InfoButton infoText="To increase performance, your pool balances are cached for this list view. If you just made an invest or withdraw, it may take a few seconds for the change to be reflected here." />
                        </Flex>
                    </GridItem>
                )}
                <GridItem textAlign="right">
                    {showMyInvestments ? (
                        <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                            TVL
                        </Text>
                    ) : (
                        <PoolListSortLink
                            title="TVL"
                            orderDirection={state.orderBy === 'totalLiquidity' ? state.orderDirection : null}
                            onClick={() => changeSort('totalLiquidity')}
                        />
                    )}
                </GridItem>
                <GridItem
                    textAlign="right"
                    display={showMyInvestments ? { base: 'block', lg: 'none', xl: 'block' } : 'block'}
                >
                    {showMyInvestments ? (
                        <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                            Volume (24h)
                        </Text>
                    ) : (
                        <PoolListSortLink
                            title="Volume (24h)"
                            orderDirection={state.orderBy === 'volume24h' ? state.orderDirection : null}
                            onClick={() => changeSort('volume24h')}
                        />
                    )}
                </GridItem>
                <GridItem textAlign="right" pr="4">
                    {showMyInvestments ? (
                        <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                            APR
                        </Text>
                    ) : (
                        <PoolListSortLink
                            title="APR"
                            orderDirection={state.orderBy === 'apr' ? state.orderDirection : null}
                            onClick={() => changeSort('apr')}
                        />
                    )}
                </GridItem>
            </Grid>
        </>
    );
}
