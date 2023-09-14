import { HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';

interface Props {
    inputAmounts: AmountHumanReadableMap | undefined;
    selectedOptions:
        | {
              [poolTokenIndex: string]: string;
          }
        | undefined;
}

export function PoolInvestPriceImpact({ inputAmounts, selectedOptions }: Props) {
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn({ inputAmounts, selectedOptions });

    return (
        <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
            <HStack width="full" justifyContent="space-between">
                <Text color="gray.100" fontSize=".85rem">
                    Price impact
                </Text>
                {isLoading ? (
                    <Skeleton h="3" w="12" />
                ) : (
                    <Text
                        fontSize=".85rem"
                        color={hasHighPriceImpact ? 'beets.red' : hasMediumPriceImpact ? 'orange' : 'white'}
                    >
                        {formattedPriceImpact}
                    </Text>
                )}
            </HStack>
        </VStack>
    );
}
