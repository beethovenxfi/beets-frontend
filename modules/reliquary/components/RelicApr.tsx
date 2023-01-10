import { HStack, Text, VStack, Badge } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import useReliquary from '../lib/useReliquary';
import { usePool } from '~/modules/pool/lib/usePool';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import { formatDistance } from 'date-fns';
import Card from '~/components/card/Card';

export default function RelicApr() {
    const { pool } = usePool();
    const { maturityThresholds, isLoading, selectedRelic, selectedRelicLevel, selectedRelicApr } = useReliquary();
    const { isMaxMaturity, entryDate, levelUpDate } = relicGetMaturityProgress(selectedRelic, maturityThresholds);
    const [levelUpCountdown, setLevelUpCountdown] = useState('');
    //TODO: fix this

    useEffect(() => {
        let interval: NodeJS.Timer;
        if (!isLoading) {
            interval = setInterval(() => {
                setLevelUpCountdown(formatDistance(levelUpDate, entryDate, { includeSeconds: true }));
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isLoading]);

    return (
        <Card px="2" py="4" h="full">
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Relic APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(selectedRelicApr).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                </HStack>
                <HStack
                    px="3"
                    py="0.5"
                    rounded="md"
                    backgroundColor="beets.light"
                    w={{ base: 'min-content' }}
                    whiteSpace="nowrap"
                >
                    <Text fontWeight="semibold">Maturity boost</Text>
                    <Badge bg="none" colorScheme="green" p="1">
                        {selectedRelicLevel?.allocationPoints}x
                    </Badge>
                </HStack>
            </VStack>
        </Card>
    );
}
