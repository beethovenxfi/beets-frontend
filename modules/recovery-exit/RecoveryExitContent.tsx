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
import { useGetUserGaugeStakedBalances } from './lib/useGetUserGaugeStakedBalances';

const RECOVERY_POOL_IDS = [
    '0x62cf35db540152e94936de63efc90d880d4e241b0000000000000000000000ef',
    '0x20715545c15c76461861cb0d6ba96929766d05a50000000000000000000000e8',
    '0xf970659221bb9d01b615321b63a26e857ffc030b0000000000000000000000e9',
    '0x23ca0306b21ea71552b148cf3c4db4fc85ae19290000000000000000000000ac',
    '0x62ec8b26c08ffe504f22390a65e6e3c1e45e987700000000000000000000007e',
    '0xb96c5bada4bf6a70e71795a3197ba94751dae2db00000000000000000000007d',
    '0xedcfaf390906a8f91fb35b7bac23f3111dbaee1c00000000000000000000007c',
];
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

    const poolStakingMap: { [key: string]: string }[] = pools
        .filter((pool) => pool.staking)
        .map((pool) => ({ [pool.address]: pool.staking!.address }));
    const stakingAddresses = poolStakingMap.map((entry) => Object.entries(entry)[0][1]);

    const {
        data: userGaugeStakedBalances,
        isLoading: isLoadingStakedBalances,
        refetch: refetchGaugeBalances,
        isRefetching: isRefetchingGaugeBalances,
    } = useGetUserGaugeStakedBalances(stakingAddresses);

    const {
        userBalances,
        getUserBalance,
        refetch: refetchUserBalances,
        isRefetching,
        isLoading,
    } = useUserBalances(RECOVERY_POOL_ADDRESSES, bpts);

    const filteredPools = pools.filter(
        (pool) =>
            parseFloat(getUserBalance(pool.address)) !== 0 ||
            (pool.staking &&
                userGaugeStakedBalances &&
                typeof userGaugeStakedBalances !== 'string' &&
                userGaugeStakedBalances.find((gauge) => gauge.address === pool.staking?.address)?.amount !== '0.0'),
    );

    return (
        <Box>
            <PaginatedTable
                items={filteredPools}
                currentPage={1}
                pageSize={100}
                count={count}
                loading={loading || isRefetching || isLoading || isLoadingStakedBalances || isRefetchingGaugeBalances}
                fetchingMore={false}
                renderTableHeader={() => <RecoveryExitWithdrawTableHeader />}
                renderTableRow={(item: GqlPoolMinimalFragment, index) => {
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
                            userBalance={getUserBalance(item.address)}
                            gaugeBalance={
                                typeof userGaugeStakedBalances === 'string'
                                    ? userGaugeStakedBalances
                                    : userGaugeStakedBalances?.find((gauge) => gauge.address === item.staking?.address)
                                          ?.amount || '0'
                            }
                            refetchGaugeBalances={refetchGaugeBalances}
                            userBalanceValue={
                                (parseFloat(getUserBalance(item.address)) / parseFloat(item.dynamicData.totalShares)) *
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
