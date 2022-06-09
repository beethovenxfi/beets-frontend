import { Divider, HStack, Text, VStack, Badge } from '@chakra-ui/layout';
import Card from '~/components/card/Card';
import { usePool } from '../../lib/usePool';
import { PoolCompositionChart } from './PoolCompositionChart';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';

export default function PoolStats() {
    const { pool, poolTokensWithoutPhantomBpt } = usePool();

    return (
        <Card padding="4" minWidth="300px" width="300px" height="full">
            <VStack spacing="4" width="full" alignItems="flex-start">
                <VStack spacing="0" alignItems="flex-start">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        Pool APR
                    </Text>
                    <HStack>
                        <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                        <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                    </HStack>
                </VStack>
                <Divider />
                <VStack spacing="0" alignItems="flex-start">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        TVL
                    </Text>
                    <Text color="white" fontSize="1.75rem">
                        {numeral(pool.dynamicData.totalLiquidity).format('$0,0.00a')}
                    </Text>
                    <Badge colorScheme="green">0.00%</Badge>
                </VStack>
                <VStack spacing="0" alignItems="flex-start">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        24h Volume
                    </Text>
                    <Text color="white" fontSize="1.75rem">
                        {numeral(pool.dynamicData.volume24h).format('$0,0.00a')}
                    </Text>
                    <Badge colorScheme="green">0.00%</Badge>
                </VStack>
                <VStack spacing="0" alignItems="flex-start">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        24h Fees
                    </Text>
                    <Text color="white" fontSize="1.75rem">
                        {numeral(pool.dynamicData.fees24h).format('$0,0.00a')}
                    </Text>
                    <Badge colorScheme="green">0.00%</Badge>
                </VStack>
                <Divider />
            </VStack>
        </Card>
    );
}
