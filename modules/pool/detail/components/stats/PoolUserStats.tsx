import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { Flex, Skeleton } from '@chakra-ui/react';
import { PoolUserStakedStats } from '~/modules/pool/detail/components/stats/PoolUserStakedStats';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { PoolBadgeSmall } from '~/components/pool-badge/PoolBadgeSmall';
import useStakingBoosts from '~/lib/global/useStakingBoosts';

export default function PoolUserStats() {
    const { pool, totalApr } = usePool();
    const { userPoolBalanceUSD, isLoading } = usePoolUserDepositBalance();
    const { poolBadgeTypes, investDisabled } = useNetworkConfig();
    const { boost } = useStakingBoosts();

    const boostedApr = pool.dynamicData.apr.items.reduce((acc, curr) => {
        if (curr.apr.__typename === 'GqlPoolAprTotal') {
            return acc + parseFloat(curr.apr.total);
        } else if (curr.title.includes('BAL')) {
            return acc + parseFloat(boost) * parseFloat(curr.apr.min);
        } else {
            return totalApr;
        }
    }, 0);

    const myApr =
        pool.staking?.type === 'GAUGE' && pool.dynamicData.apr.items.find((item) => item.title.includes('BAL'))
            ? boostedApr
            : totalApr;

    const showZeroApr = pool && Object.keys(investDisabled).includes(pool.id);

    return (
        <Flex width="full" alignItems="flex-start" flex={1} flexDirection="column">
            <VStack spacing="0" alignItems="flex-start" mb="4" px="2">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My APR
                </Text>
                <HStack>
                    {showZeroApr ? (
                        <Text fontSize="1.75rem" fontWeight="semibold">
                            0.00%
                        </Text>
                    ) : (
                        <>
                            <div className="apr-stripes">{numeral(myApr).format('0.00%')}</div>
                            <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                        </>
                    )}
                </HStack>
                {poolBadgeTypes[pool.id] && <PoolBadgeSmall poolBadge={poolBadgeTypes[pool.id]} />}
            </VStack>

            <Box px="2" width="full">
                <Divider mb="4" />
            </Box>
            <VStack spacing="0" alignItems="flex-start" mb="4" px="2">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My liquidity
                </Text>
                {isLoading ? (
                    <Box>
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    </Box>
                ) : (
                    <Text color="white" fontSize="1.75rem">
                        {numberFormatUSDValue(userPoolBalanceUSD)}
                    </Text>
                )}
            </VStack>
            {pool.staking && (
                <PoolUserStakedStats
                    poolAddress={pool.address}
                    staking={pool.staking}
                    totalApr={myApr}
                    userPoolBalanceUSD={userPoolBalanceUSD}
                />
            )}
            {/*<PoolDetailPossibleYieldText />*/}
        </Flex>
    );
}
