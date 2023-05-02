import { HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';

export function PoolInvestPriceImpact() {
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    return (
        <VStack width="full" py="4" backgroundColor="modalSubsection" px="5" roundedBottom='lg'>
            <HStack width="full" justifyContent="space-between">
                <Text color="inline" fontSize=".85rem">
                    Price impact
                </Text>
                {isLoading ? (
                    <Skeleton h="3" w="12" />
                ) : (
                    <Text
                        fontSize=".85rem"
                        color={hasHighPriceImpact ? 'beets.red' : hasMediumPriceImpact ? 'orange' : 'inline'}
                    >
                        {formattedPriceImpact}
                    </Text>
                )}
            </HStack>
        </VStack>
    );
}
