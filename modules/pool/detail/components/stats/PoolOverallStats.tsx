import { Divider, HStack, Text, VStack, Badge } from '@chakra-ui/layout';
import Card from '~/components/card/Card';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { ArrowUp } from 'react-feather';

export default function PoolOverallStats() {
    const { pool } = usePool();
    const data = pool.dynamicData;
    const volumeYesterday = parseFloat(data.volume48h) - parseFloat(data.volume24h);
    const volumePercentChange = (parseFloat(data.volume24h) - volumeYesterday) / volumeYesterday;
    const tvlPercentChange =
        (parseFloat(data.totalLiquidity) - parseFloat(data.totalLiquidity24hAgo)) /
        parseFloat(data.totalLiquidity24hAgo);

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
                    TVL
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(data.totalLiquidity).format('$0,0.00a')}
                </Text>
                <Badge colorScheme="green">{numeral(tvlPercentChange).format('0.00%')}</Badge>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    24h Volume
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(data.volume24h).format('$0,0.00a')}
                </Text>
                <Badge colorScheme={volumePercentChange >= 0 ? 'green' : 'red'}>
                    {numeral(volumePercentChange).format('0.00%')}
                </Badge>
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
