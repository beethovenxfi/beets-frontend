import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import React from 'react';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import useReliquary from '~/modules/reliquary/hooks/useReliquary';
import { relicGetMaturityProgress } from '~/modules/reliquary/lib/reliquary-helpers';

export function RelicHeader() {
    const { maturityThresholds, relicPositions = [] } = useReliquary();
    const { progressToNextLevel } = relicGetMaturityProgress(relicPositions[0], maturityThresholds);
    //TODO: fix this
    const relic = relicPositions && relicPositions[0];

    return (
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
    );
}
