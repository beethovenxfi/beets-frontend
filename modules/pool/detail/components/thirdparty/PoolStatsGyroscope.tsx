import { Divider, VStack, Text } from '@chakra-ui/react';
import { orderBy } from 'lodash';
import numeral from 'numeral';
import { GqlPoolTokenUnion } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    alpha: string;
    beta: string;
    formattedTypeName: string;
    poolTokens: GqlPoolTokenUnion[];
}

function formatPriceRange(alpha: string, beta: string, poolTokens: GqlPoolTokenUnion[]) {
    const tokens = orderBy(poolTokens, ['priceRate'], ['desc']);
    const priceRates = tokens.map((token) => parseFloat(token.priceRate));
    let priceRange;

    // If all price rates are greater than 1, it's probably a rehype pool so use the alpha-beta range
    if (priceRates.every((rate) => rate > 1)) {
        priceRange = `${numeral(alpha).format('0.0000a')} - ${numeral(beta).format('0.0000a')}`;
    } else {
        priceRange = [alpha, beta]
            .map((value) => numeral((parseFloat(value) * priceRates[0]) / priceRates[1]).format('0.0000a'))
            .join(' - ');
    }

    return (
        <>
            <Text color="white" fontSize="1.75rem">
                {priceRange}
            </Text>
            <Text color="white" fontSize="sm">
                {tokens.length > 2 ? 'All asset pairs' : `${tokens[0].symbol} / ${tokens[1].symbol}`}
            </Text>
        </>
    );
}

export default function PoolStatsGyroscope({ alpha, beta, formattedTypeName, poolTokens }: Props) {
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
                {formatPriceRange(alpha, beta, poolTokens)}
            </VStack>
        </>
    );
}
