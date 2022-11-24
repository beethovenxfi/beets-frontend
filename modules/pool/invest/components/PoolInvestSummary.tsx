import { Box, BoxProps, Flex, Heading, HStack, Skeleton, VStack, Text } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import numeral from 'numeral';

import { CardRow } from '~/components/card/CardRow';
import { usePool } from '~/modules/pool/lib/usePool';
import React from 'react';

interface Props extends BoxProps {}

export function PoolInvestSummary({ ...rest }: Props) {
    const { pool } = usePool();
    const { totalInvestValue } = useInvest();
    const weeklyYield = (totalInvestValue * parseFloat(pool.dynamicData.apr.total)) / 52;
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    return (
        <VStack spacing="4" width="full" backgroundColor="blackAlpha.100" p="4" rounded="md">
            <HStack spacing="8">
                <Box>
                    <Heading size="sm" textAlign="center">
                        Your investment total is
                    </Heading>
                    <Heading color="beets.green" textAlign="center">
                        {numberFormatUSDValue(totalInvestValue)}
                    </Heading>
                </Box>
                <Box>
                    <Heading size="sm" textAlign="center">
                        Potential weekly yield
                    </Heading>
                    <HStack justifyContent="center">
                        <Heading color="beets.highlight" textAlign="center">
                            {numberFormatUSDValue(weeklyYield)}
                        </Heading>
                        <AprTooltip data={pool.dynamicData.apr} onlySparkles={true} sparklesSize="sm" />
                    </HStack>
                </Box>
            </HStack>
        </VStack>
    );
}
