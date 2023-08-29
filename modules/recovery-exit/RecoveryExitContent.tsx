import { useGetTokens } from '~/lib/global/useToken';
import { Box, useDisclosure } from '@chakra-ui/react';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import {
    GqlPoolLinearFragment,
    GqlPoolMinimalFragment,
    useGetPoolsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { LinearPoolActionsModal } from '~/modules/linear-pools/components/LinearPoolActionsModal';
import { useState } from 'react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { RecoveryExitWithdrawListItem } from '~/modules/recovery-exit/components/RecoveryExitWithdrawListItem';
import { RecoveryExitWithdrawTableHeader } from '~/modules/recovery-exit/components/RecoveryExitWithdrawTableHeader';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useGetRecoveryPoolTokens } from '~/modules/recovery-exit/lib/useGetRecoveryPoolTokens';
import { networkConfig } from '~/lib/config/network-config';

const RECOVERY_POOL_IDS = networkConfig.recoveryPools;
const RECOVERY_POOL_ADDRESSES = RECOVERY_POOL_IDS.map((id) => id.slice(0, 42));

export function RecoveryExitContent() {
    const networkConfig = useNetworkConfig();
    const { data, loading } = useGetPoolsQuery({
        variables: {
            first: 1000,
            skip: 0,
            orderBy: 'totalLiquidity',
            orderDirection: 'desc',
            where: { idIn: RECOVERY_POOL_IDS, chainIn: [networkConfig.chainName] },
        },
    });

    const { poolTokens } = useGetRecoveryPoolTokens(RECOVERY_POOL_IDS);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPool, setSelectedPool] = useState<GqlPoolLinearFragment | null>(null);
    const { getToken, priceForAmount } = useGetTokens();
    const pools: GqlPoolMinimalFragment[] = data?.poolGetPools || [];
    const bpts = pools.map((pool) => ({ ...pool, decimals: 18 }));
    const count = data?.count || 0;

    const {
        userBalances,
        getUserBalance,
        refetch: refetchUserBalances,
        isRefetching,
        isLoading,
    } = useUserBalances(RECOVERY_POOL_ADDRESSES, bpts);

    const filteredPools = pools.filter((pool) => parseFloat(getUserBalance(pool.address)) !== 0);

    return (
        <Box>
            <PaginatedTable
                items={filteredPools}
                currentPage={1}
                pageSize={100}
                count={count}
                loading={loading || isRefetching || isLoading}
                fetchingMore={false}
                renderTableHeader={() => <RecoveryExitWithdrawTableHeader />}
                renderTableRow={(item: GqlPoolMinimalFragment, index) => {
                    const userBalance = getUserBalance(item.address);
                    return (
                        <RecoveryExitWithdrawListItem
                            key={index}
                            pool={item}
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
                            userBalance={userBalance}
                            userBalanceValue={
                                (parseFloat(userBalance) / parseFloat(item.dynamicData.totalShares)) *
                                parseFloat(item.dynamicData.totalLiquidity)
                            }
                            onSettled={() => {
                                refetchUserBalances().catch();
                            }}
                            poolTokens={poolTokens.find((pt) => pt.poolId === item.id)?.tokens || []}
                        />
                    );
                }}
            />
            <LinearPoolActionsModal isOpen={isOpen} onClose={onClose} pool={selectedPool} />
        </Box>
    );
}
