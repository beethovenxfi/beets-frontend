import { Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Tooltip } from '@chakra-ui/react';
import { networkConfig } from '~/lib/config/network-config';
import { useGetBlocksPerDayQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import { InfoButton } from '~/components/info-button/InfoButton';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { PoolBadgeSmall } from '~/components/pool-badge/PoolBadgeSmall';
import PoolStatsGyroscope from '../thirdparty/PoolStatsGyroscope';
import { getApr } from '~/lib/util/apr-util';

export default function PoolOverallStats() {
    const { pool, formattedTypeName } = usePool();
    const { poolBadgeTypes, investDisabled } = useNetworkConfig();
    const { priceFor } = useGetTokens();
    const { data: blocksData } = useGetBlocksPerDayQuery({ fetchPolicy: 'cache-first' });
    const data = pool.dynamicData;
    const volumeYesterday = parseFloat(data.volume48h) - parseFloat(data.volume24h);
    const volumePercentChange =
        volumeYesterday !== 0 ? (parseFloat(data.volume24h) - volumeYesterday) / volumeYesterday : 0;
    const tvlPercentChange =
        (parseFloat(data.totalLiquidity) - parseFloat(data.totalLiquidity24hAgo)) /
        parseFloat(data.totalLiquidity24hAgo);

    const sharePrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);
    const totalShares24hAgo = parseFloat(pool.dynamicData.totalShares24hAgo);
    const sharePrice24hAgo =
        totalShares24hAgo > 0 ? parseFloat(pool.dynamicData.totalLiquidity24hAgo) / totalShares24hAgo : 0;
    const sharePricePercentChange = (sharePrice - sharePrice24hAgo) / sharePrice24hAgo;
    const beetsPerDay = parseFloat(pool.staking?.farm?.beetsPerBlock || '0') * (blocksData?.blocksPerDay || 0);

    const rewards = pool.staking?.farm?.rewarders || pool.staking?.gauge?.rewards;
    const rewardsMapped = rewards?.map(({ tokenAddress, rewardPerSecond }) => ({ tokenAddress, rewardPerSecond }));
    const hasNonZeroRewards = (rewardsMapped || []).filter((reward) => reward.rewardPerSecond !== '0').length !== 0;

    const incentivesDailyValue =
        beetsPerDay * priceFor(networkConfig.beets.address) +
        sumBy(
            rewardsMapped || [],
            (rewarder) => priceFor(rewarder.tokenAddress) * parseFloat(rewarder.rewardPerSecond) * 86400,
        );

    const showZeroApr = pool && Object.keys(investDisabled).includes(pool.id);

    return (
        <VStack spacing="4" width="full" alignItems="flex-start" px="2">
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Pool APR
                </Text>
                <HStack>
                    {showZeroApr ? (
                        <Text fontSize="1.75rem" fontWeight="semibold">
                            0.00%
                        </Text>
                    ) : (
                        <>
                            <div className="apr-stripes">{getApr(pool.dynamicData.apr.apr)}</div>
                            <AprTooltip onlySparkles data={data.apr} poolId={pool.id} />
                        </>
                    )}
                </HStack>
                {poolBadgeTypes[pool.id] && <PoolBadgeSmall poolBadge={poolBadgeTypes[pool.id]} />}
            </VStack>
            {pool.__typename === 'GqlPoolGyro' && (
                <PoolStatsGyroscope
                    alpha={pool.alpha}
                    beta={pool.beta}
                    formattedTypeName={formattedTypeName}
                    poolTokens={pool.tokens}
                />
            )}
            <Divider />
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    BPT price
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numberFormatUSDValue(sharePrice)}
                </Text>
                <PercentChangeBadge percentChange={sharePricePercentChange} />
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    TVL
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(data.totalLiquidity).format('$0,0.00a')}
                </Text>
                <PercentChangeBadge percentChange={tvlPercentChange} />
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    24h Volume
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numberFormatUSDValue(data.volume24h)}
                </Text>
                <PercentChangeBadge percentChange={volumePercentChange} />
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    24h Fees
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numberFormatUSDValue(data.fees24h)}
                </Text>
            </VStack>
            {(hasNonZeroRewards || beetsPerDay > 0) && (
                <VStack spacing="1" alignItems="flex-start">
                    <InfoButton
                        labelProps={{
                            lineHeight: '1rem',
                            fontWeight: 'semibold',
                            fontSize: 'sm',
                            color: 'beets.base.50',
                        }}
                        label="Liquidity incentives"
                        infoText={`Liquidity incentives are additional incentives available for this pool when you stake your BPT in the ${networkConfig.farmTypeName}. The daily value is an approximation based on current token prices and emissions.`}
                    />
                    {incentivesDailyValue > 0 && (
                        <Text color="white" fontSize="1.75rem">
                            ~{numeral(incentivesDailyValue).format('$0,0.00a')}
                            <Text as="span" fontSize="md">
                                {' '}
                                / day
                            </Text>
                        </Text>
                    )}
                    {beetsPerDay > 0 && (
                        <HStack spacing="1" mb="0.5">
                            <TokenAvatar height="20px" width="20px" address={networkConfig.beets.address} />
                            <Tooltip
                                label={`BEETS emissions are calculated per block, so daily emissions are an estimate based on an average block time over last 5,000 blocks. Avg block time: ${blocksData?.avgBlockTime}s.`}
                            >
                                <Text fontSize="1rem" lineHeight="1rem">
                                    {numeral(beetsPerDay).format('0,0')} / day
                                </Text>
                            </Tooltip>
                        </HStack>
                    )}
                    {rewards &&
                        rewards.map((reward) => {
                            if (!reward || reward.rewardPerSecond === '0.0') {
                                return null;
                            }
                            return (
                                <HStack spacing="1" mb="0.5" key={reward.id}>
                                    <TokenAvatar height="20px" width="20px" address={reward.tokenAddress} />
                                    <Text fontSize="1rem" lineHeight="1rem">
                                        {numeral(parseFloat(reward.rewardPerSecond) * 86400).format('0,0')} / day
                                    </Text>
                                </HStack>
                            );
                        })}
                </VStack>
            )}
        </VStack>
    );
}
