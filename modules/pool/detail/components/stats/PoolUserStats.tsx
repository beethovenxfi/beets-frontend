import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { Flex, Skeleton } from '@chakra-ui/react';
import { PoolUserStakedStats } from '~/modules/pool/detail/components/stats/PoolUserStakedStats';
import { usePool } from '~/modules/pool/lib/usePool';
import { BoostedBadgeSmall } from '~/components/boosted-badge/BoostedBadgeSmall';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export default function PoolUserStats() {
    const { pool, totalApr } = usePool();
    const { userPoolBalanceUSD, isLoading } = usePoolUserDepositBalance();
    const { boostedByTypes } = useNetworkConfig();

    return (
        <Flex width="full" alignItems="flex-start" flex={1} flexDirection="column">
            <VStack spacing="0" alignItems="flex-start" mb="4" px="2">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                </HStack>
                {boostedByTypes[pool.id] && <BoostedBadgeSmall boostedBy={boostedByTypes[pool.id]} />}
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
                    totalApr={totalApr}
                    userPoolBalanceUSD={userPoolBalanceUSD}
                />
            )}
            {/*<PoolDetailPossibleYieldText />*/}
        </Flex>
    );
}
