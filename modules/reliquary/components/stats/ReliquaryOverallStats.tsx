import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { usePool } from '~/modules/pool/lib/usePool';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from '~/lib/global/useToken';
import { InfoButton } from '~/components/info-button/InfoButton';
import Card from '~/components/card/Card';
import { useReliquaryGlobalStats } from '../../lib/useReliquaryGlobalStats';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import startOfWeek from 'date-fns/startOfWeek';
import { useGetReliquaryFarmSnapshotsQuery } from '~/apollo/generated/graphql-codegen-generated';

export default function ReliquaryOverallStats() {
    const { pool } = usePool();
    const { priceFor, getToken } = useGetTokens();
    const { data: globalStats } = useReliquaryGlobalStats();
    const { data: snapshotData } = useGetReliquaryFarmSnapshotsQuery({
        variables: { id: networkConfig.reliquary.fbeets.farmId.toString(), range: 'THIRTY_DAYS' },
    });

    const data = pool.dynamicData;

    const [{ apr: minApr }] = data.apr.items.filter((item) => item.title.includes('Min'));
    const [{ apr: maxApr }] = data.apr.items.filter((item) => item.title.includes('Max'));

    const tvlPercentChange =
        (parseFloat(data.totalLiquidity) - parseFloat(data.totalLiquidity24hAgo)) /
        parseFloat(data.totalLiquidity24hAgo);

    const beetsPerDay = parseFloat(pool.staking?.reliquary?.beetsPerSecond || '0') * 86400;
    const incentivesDailyValue = beetsPerDay * priceFor(networkConfig.beets.address);

    const relicTokenBalancesWithSymbol = globalStats?.tokenBalances?.map((token) => ({
        ...token,
        symbol: getToken(token.address)?.symbol,
    }));

    const relicMaturityLevels = globalStats?.levelBalances.map((balance) => ({
        level: parseInt(balance.level),
        percentageOfTotal: parseFloat(balance.balance) / parseFloat(globalStats.totalBalance),
    }));
    const avgRelicMaturity = numeral(
        relicMaturityLevels?.reduce((total, obj) => total + obj.level * obj.percentageOfTotal, 1),
    ).format('0.00');

    const maxPercentageOfLevels = relicMaturityLevels?.reduce((prev, curr) =>
        prev.percentageOfTotal > curr.percentageOfTotal ? prev : curr,
    );

    const avgValuePerRelic = parseInt(globalStats?.totalLiquidity || '') / parseInt(globalStats?.relicCount || '');

    const today = Date.now();
    const cutOffDate = startOfWeek(today).getTime();
    const snapshotsThisWeek = snapshotData?.snapshots.filter((snapshot) => snapshot.timestamp >= cutOffDate / 1000);

    let numberOfRelicsThisWeek = 0;
    if (snapshotsThisWeek) {
        numberOfRelicsThisWeek =
            parseInt(snapshotsThisWeek[snapshotsThisWeek.length - 1]?.relicCount || '') -
            parseInt(snapshotsThisWeek[0]?.relicCount || '');
        if (Number.isNaN(numberOfRelicsThisWeek)) {
            numberOfRelicsThisWeek = 0;
        }
    }

    return (
        <Card px="2" py="4" h="full" w="full">
            <VStack spacing="4" width="full" alignItems="flex-start" px="2">
                <VStack spacing="0" alignItems="flex-start">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        APR
                    </Text>
                    <HStack>
                        <div className="apr-stripes">
                            {numeral(minApr).format('0.00%')} - {numeral(maxApr).format('0.00%')}
                        </div>
                        <AprTooltip onlySparkles data={data.apr} />
                    </HStack>
                </VStack>
                <Divider />
                <VStack width="full" spacing="8" alignItems="flex-start">
                    <VStack spacing="4" alignItems="flex-start">
                        <VStack width="full" alignItems="flex-start" spacing="0">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                TVL
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numeral(data.totalLiquidity).format('$0,0.00a')}
                            </Text>
                            <PercentChangeBadge percentChange={tvlPercentChange} />
                        </VStack>
                        <VStack width="full" spacing="0" alignItems="flex-start">
                            <VStack spacing="1" alignItems="flex-start" mb="2">
                                {relicTokenBalancesWithSymbol?.map((token, index) => (
                                    <HStack spacing="1" mb="0.5" key={index}>
                                        <TokenAvatar h="20px" w="20px" address={token.address} />
                                        <Text fontSize="1rem" lineHeight="1rem">
                                            {tokenFormatAmount(token.balance)}
                                        </Text>
                                        <Text fontSize="1rem" lineHeight="1rem">
                                            {token.symbol}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    </VStack>
                    {pool.staking?.reliquary && (
                        <VStack spacing="0" alignItems="flex-start">
                            <InfoButton
                                labelProps={{
                                    lineHeight: '1rem',
                                    fontWeight: 'semibold',
                                    fontSize: 'sm',
                                    color: 'beets.base.50',
                                }}
                                label="Liquidity incentives"
                                infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                            />
                            <Text color="white" fontSize="1.75rem">
                                ~{numeral(incentivesDailyValue).format('$0,0.00a')}
                                <Text as="span" fontSize="md">
                                    &nbsp;/ day
                                </Text>
                            </Text>
                            <Box>
                                {beetsPerDay > 0 && (
                                    <HStack spacing="1" mb="0.5">
                                        <TokenAvatar height="20px" width="20px" address={networkConfig.beets.address} />
                                        <Text fontSize="1rem" lineHeight="1rem">
                                            {numeral(beetsPerDay).format('0,0')}&nbsp;/ day
                                        </Text>
                                    </HStack>
                                )}
                            </Box>
                        </VStack>
                    )}
                    <VStack spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Relic Maturity
                        </Text>
                        <Text color="white" fontSize="1.75rem">
                            {avgRelicMaturity}
                            <Text as="span" fontSize="md">
                                &nbsp;avg level
                            </Text>
                        </Text>
                        <Text fontSize="1rem" lineHeight="1rem">
                            {`${numeral(maxPercentageOfLevels?.percentageOfTotal).format(
                                '0%',
                            )} of all relics are level ${maxPercentageOfLevels?.level}`}
                        </Text>
                    </VStack>
                    <VStack spacing="0" alignItems="flex-start">
                        <InfoButton
                            labelProps={{
                                lineHeight: '1rem',
                                fontWeight: 'semibold',
                                fontSize: 'sm',
                                color: 'beets.base.50',
                            }}
                            label="Relics minted"
                            infoText="Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
                        />
                        <Text color="white" fontSize="1.75rem">
                            {numeral(globalStats?.relicCount).format('0,0')}
                        </Text>
                        <Text fontSize="1rem" lineHeight="1rem">
                            {`Average value per relic is ${numberFormatUSDValue(avgValuePerRelic)}`}
                        </Text>
                        <Text fontSize="1rem" lineHeight="1rem">
                            {`${numberOfRelicsThisWeek} relics minted this week`}
                        </Text>
                    </VStack>
                </VStack>
            </VStack>
        </Card>
    );
}
