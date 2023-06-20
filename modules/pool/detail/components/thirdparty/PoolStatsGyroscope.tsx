import { Divider, VStack, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { GqlPoolTokenUnion } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    alpha: string;
    beta: string;
    formattedTypeName: string;
    poolTokens: GqlPoolTokenUnion[];
}

export default function PoolStatsGyroscope({ alpha, beta, formattedTypeName, poolTokens }: Props) {
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
                    {poolTokens.length > 2 ? 'All asset pairs' : `${poolTokens[0].symbol} / ${poolTokens[1].symbol}`}
                </Text>
            </VStack>
        </>
    );
}
