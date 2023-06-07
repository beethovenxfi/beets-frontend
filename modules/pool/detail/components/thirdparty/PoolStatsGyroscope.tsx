import { Divider, VStack, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { usePool } from '~/modules/pool/lib/usePool';

export default function PoolOverallStats() {
    const { pool, formattedTypeName } = usePool();

    // TODO: fetch from backend
    const alpha = '0.97';
    const beta = '1.02';

    const formatNumber = (value: string) => numeral(value).format('0.0000a');

    return (
        <>
            <Divider />
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Pool type
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {formattedTypeName}
                </Text>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Price range
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {`${formatNumber(alpha)} - ${formatNumber(beta)}`}
                </Text>
                <Text color="white" fontSize="sm">
                    {pool.tokens.length > 2 ? 'All asset pairs' : `${pool.tokens[0].symbol} / ${pool.tokens[1].symbol}`}
                </Text>
            </VStack>
        </>
    );
}
