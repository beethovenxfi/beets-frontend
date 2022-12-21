import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import useReliquary from '../hooks/useReliquary';
import { RelicNFT } from '~/modules/reliquary/components/RelicNFT';
import { RelicStats } from '~/modules/reliquary/components/RelicStats';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { relicGetMaturityProgress } from '~/modules/reliquary/lib/reliquary-helpers';

export function RelicContainer() {
    const { maturityThresholds, relicPositions = [] } = useReliquary();
    const { progressToNextLevel } = relicGetMaturityProgress(relicPositions[0], maturityThresholds);
    const relic = relicPositions && relicPositions[0];

    return (
        <Box width="full">
            <Flex>
                <Box flex="1">
                    <Heading size="lg">My Relic: #{relic.relicId}</Heading>
                    <HStack width="50%" py="4" position="relative" spacing="0" justifyContent="center">
                        <Box px="3" py="0.5" rounded="md" backgroundColor="beets.light" width="110px">
                            <Text fontWeight="semibold">Level {relic?.level + 1}</Text>
                        </Box>
                        <AnimatedProgress
                            value={progressToNextLevel}
                            width="100%"
                            borderTopRightRadius="lg"
                            borderBottomRightRadius="lg"
                            borderTopLeftRadius="none"
                            borderBottomLeftRadius="none"
                        />
                    </HStack>
                </Box>
                <Box>
                    <HStack>
                        <PoolInvestModal
                            activator={
                                <Button width="140px" variant="primary">
                                    Invest
                                </Button>
                            }
                        />
                        <PoolWithdrawModal
                            activator={
                                <Button width="140px" variant="secondary">
                                    Withdraw
                                </Button>
                            }
                        />
                    </HStack>
                </Box>
            </Flex>
            <HStack width="full" alignItems="flex-start" spacing="0" height="full">
                <VStack alignItems="flex-start" mt="8" spacing="4" width="40%">
                    <RelicStats />
                </VStack>
                <HStack flex={1} mt="4" alignItems="center" justifyContent="center">
                    <RelicNFT />
                </HStack>
            </HStack>
        </Box>
    );
}
