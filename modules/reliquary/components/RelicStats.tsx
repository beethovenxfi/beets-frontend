import Card from '~/components/card/Card';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import React, { useState } from 'react';
import { useAnimation } from 'framer-motion';
import useReliquary from '~/modules/reliquary/hooks/useReliquary';
import { useReliquaryLevelUp } from '~/modules/reliquary/hooks/useReliquaryLevelUp';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import RelicMaturity from './RelicMaturity';
import RelicAchievements from './RelicAchievements';

export function RelicStats() {
    const { data, userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { pool } = usePool();
    const { reliquaryService, maturityThresholds, relicPositions = [] } = useReliquary();
    const config = useNetworkConfig();

    //TODO: fix this
    const relic = relicPositions && relicPositions[0];

    return (
        <>
            <Card p="4" width="full">
                <VStack width="full" spacing="8" justifyContent="flex-start">
                    <VStack width="full" spacing="0" alignItems="flex-start">
                        <Heading lineHeight="1rem" fontWeight="semibold" size="" color="beets.base.50">
                            Relic APR
                        </Heading>
                        <HStack>
                            <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                            <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                        </HStack>
                        <Text color="orange">1.8x maturity boost</Text>
                    </VStack>
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Pending Rewards
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numberFormatUSDValue(999.99)}
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
                <Button mt="4" width="full" variant="primary">
                    Claim now
                </Button>
            </Card>
            <Card p="4" width="full">
                <VStack spacing="8">
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                My Liquidity
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numberFormatUSDValue(userPoolBalanceUSD)}
                            </Text>
                        </VStack>
                    </HStack>

                    <VStack width="full" spacing="3" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Token breakdown
                        </Text>
                        <HStack>
                            <TokenAmountPill
                                key={`relic-token-${config.fbeets.address}`}
                                address={config.fbeets.address}
                                amount={relic.amount}
                            />
                            <Text fontWeight="bold">OR</Text>
                            {data &&
                                data.map((token) => (
                                    <TokenAmountPill
                                        key={`relic-token-${token.address}`}
                                        address={token.address}
                                        amount={token.amount}
                                    />
                                ))}
                        </HStack>
                    </VStack>
                </VStack>
            </Card>
            <RelicAchievements />
            <RelicMaturity />
        </>
    );
}
