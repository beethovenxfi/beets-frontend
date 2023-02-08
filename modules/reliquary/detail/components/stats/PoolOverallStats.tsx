import { Badge, Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Skeleton, Tooltip } from '@chakra-ui/react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { networkConfig } from '~/lib/config/network-config';
import {
    useGetBlocksPerDayQuery,
    useGetPoolBptPriceChartDataQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy } from 'lodash';
import { InfoButton } from '~/components/info-button/InfoButton';
import { BoostedBadgeSmall } from '~/components/boosted-badge/BoostedBadgeSmall';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export default function PoolOverallStats() {
    const { pool } = usePool();
    const { boostedByTypes } = useNetworkConfig();
    const { priceFor } = useGetTokens();
    const { data: blocksData } = useGetBlocksPerDayQuery({ fetchPolicy: 'cache-first' });
    const data = pool.dynamicData;
    const volumeYesterday = parseFloat(data.volume48h) - parseFloat(data.volume24h);
    const volumePercentChange = (parseFloat(data.volume24h) - volumeYesterday) / volumeYesterday;
    const tvlPercentChange =
        (parseFloat(data.totalLiquidity) - parseFloat(data.totalLiquidity24hAgo)) /
        parseFloat(data.totalLiquidity24hAgo);

    const sharePrice = parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares);
    const totalShares24hAgo = parseFloat(pool.dynamicData.totalShares24hAgo);
    const sharePrice24hAgo =
        totalShares24hAgo > 0 ? parseFloat(pool.dynamicData.totalLiquidity24hAgo) / totalShares24hAgo : 0;
    const sharePricePercentChange = (sharePrice - sharePrice24hAgo) / sharePrice24hAgo;
    const beetsPerDay = parseFloat(pool.staking?.farm?.beetsPerBlock || '0') * (blocksData?.blocksPerDay || 0);

    const incentivesDailyValue =
        beetsPerDay * priceFor(networkConfig.beets.address) +
        sumBy(
            pool.staking?.farm?.rewarders || [],
            (rewarder) => priceFor(rewarder.tokenAddress) * parseFloat(rewarder.rewardPerSecond) * 86400,
        );

    return (
        <VStack spacing="4" width="full" alignItems="flex-start" px="2">
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Pool APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(data.apr.total).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={data.apr} />
                </HStack>
                {boostedByTypes[pool.id] && <BoostedBadgeSmall boostedBy={boostedByTypes[pool.id]} />}
            </VStack>
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
                    {numeral(data.volume24h).format('$0,0.00a')}
                </Text>
                <PercentChangeBadge percentChange={volumePercentChange} />
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    24h Fees
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(data.fees24h).format('$0,0.00a')}
                </Text>
            </VStack>
            {pool.staking?.farm && (
                <VStack spacing="0" alignItems="flex-start">
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
                    <Text color="white" fontSize="1.75rem">
                        ~{numeral(incentivesDailyValue).format('$0,0.00a')}
                        <Text as="span" fontSize="md">
                            {' '}
                            / day
                        </Text>
                    </Text>
                    <Box>
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
                        {pool.staking.farm.rewarders?.map((rewarder) => (
                            <HStack spacing="1" mb="0.5" key={rewarder.id}>
                                <TokenAvatar height="20px" width="20px" address={rewarder.tokenAddress} />
                                <Text fontSize="1rem" lineHeight="1rem">
                                    {numeral(parseFloat(rewarder.rewardPerSecond) * 86400).format('0,0')} / day
                                </Text>
                            </HStack>
                        ))}
                    </Box>
                </VStack>
            )}
        </VStack>
    );
}
