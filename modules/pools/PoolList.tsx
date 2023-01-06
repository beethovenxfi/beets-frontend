import { Alert, AlertIcon, Box, Button, Link, Text, Highlight } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import { PoolListItem } from '~/modules/pools/components/PoolListItem';
import { PoolListTableHeader } from '~/modules/pools/components/PoolListTableHeader';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTop } from '~/modules/pools/components/PoolListTop';
import { useUserData } from '~/lib/user/useUserData';
import { useEffect } from 'react';
import { orderBy } from 'lodash';
import { PoolListMobileHeader } from '~/modules/pools/components/PoolListMobileHeader';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from '~/lib/global/useToken';
import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

function PoolList() {
    const { boostedByTypes, warnings } = useNetworkConfig();
    const { getToken } = useGetTokens();
    const { pools, refetch, loading, networkStatus, state, count, setPageSize, setPoolIds, showMyInvestments } =
        usePoolList();
    const { userPoolIds, usdBalanceForPool, hasBptInWalletForPool } = useUserData();
    const userPoolIdsStr = userPoolIds.join();

    useEffect(() => {
        if (showMyInvestments) {
            setPoolIds(userPoolIds).catch();
        }
    }, [userPoolIdsStr, showMyInvestments]);

    const poolsToRender = showMyInvestments ? orderBy(pools, (pool) => usdBalanceForPool(pool.id), 'desc') : pools;
    const poolCount = count || 0;
    const hasUnstakedBpt =
        showMyInvestments &&
        pools.filter((pool) => pool.dynamicData.apr.hasRewardApr && hasBptInWalletForPool(pool.id)).length > 0;

    return (
        <Box>
            <PoolListMobileHeader />
            <PoolListTop />

            {hasUnstakedBpt && (
                <Alert status="warning" mb="4">
                    <AlertIcon />
                    You have unstaked BPT in your wallet. Incentivized pools offer additional rewards that will
                    accumulate over time when your BPT are staked.
                </Alert>
            )}
            <PaginatedTable
                items={poolsToRender}
                currentPage={state.skip / state.first + 1}
                pageSize={state.first}
                count={poolCount}
                onPageChange={(page) => {
                    refetch({ ...state, skip: state.first * (page - 1) });
                }}
                loading={loading}
                fetchingMore={networkStatus === NetworkStatus.refetch}
                onPageSizeChange={setPageSize}
                renderTableHeader={() => <PoolListTableHeader />}
                renderTableRow={(item: GqlPoolMinimalFragment, index) => {
                    return (
                        <PoolListItem
                            key={index}
                            pool={item}
                            userBalance={`${usdBalanceForPool(item.id)}`}
                            showUserBalance={showMyInvestments}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={index === pools.length - 1 ? 0 : 1}
                            bg="box.500"
                            tokens={item.displayTokens.map((token) => ({
                                ...token,
                                logoURI: getToken(token.address)?.logoURI || undefined,
                                nestedTokens: token.nestedTokens?.map((nestedToken) => ({
                                    ...nestedToken,
                                    logoURI: getToken(nestedToken.address)?.logoURI || undefined,
                                })),
                            }))}
                            hasUnstakedBpt={item.dynamicData.apr.hasRewardApr && hasBptInWalletForPool(item.id)}
                            boostedBy={boostedByTypes[item.id]}
                            warningMessage={warnings.poolList[item.id]}
                        />
                    );
                }}
            />

            <Box mt="10">
                <Text fontSize="xl" color="white" mb="4">
                    Can&apos;t find what you&apos;re looking for?
                </Text>
                <Button variant="primary" size="lg" as={Link} href={networkConfig.createPoolUrl}>
                    Compose a pool
                </Button>
            </Box>
        </Box>
    );
}

export default PoolList;
