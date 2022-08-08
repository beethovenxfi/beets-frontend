import { Badge, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';

export default function PoolOverallStats() {
    const { pool } = usePool();
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

    return (
        <VStack spacing="4" width="full" alignItems="flex-start">
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Pool APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(data.apr.total).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={data.apr} />
                </HStack>
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
        </VStack>
    );
}
