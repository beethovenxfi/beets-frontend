import { Box, Button, VStack, Text, HStack, Badge, Stack, StackDivider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import Countdown from 'react-countdown';
import { useSwiperSlide } from 'swiper/react';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import { useRelicDepositBalance } from '../lib/useRelicDepositBalance';
import useReliquary from '../lib/useReliquary';

interface Props {
    isLoading?: boolean;
    openInvestModal: () => void;
    openWithdrawModal: () => void;
}

export default function RelicSlideMainInfo({ isLoading, openInvestModal, openWithdrawModal }: Props) {
    const { isActive } = useSwiperSlide();
    const { relicPositions, selectedRelic, maturityThresholds } = useReliquary();
    const config = useNetworkConfig();
    const { relicBalanceUSD } = useRelicDepositBalance();

    const { progressToNextLevel, levelUpDate, isMaxMaturity } = relicGetMaturityProgress(
        selectedRelic,
        maturityThresholds,
    );
    const hasNoRelics = relicPositions.length === 0;

    return (
        <Box height="full" width="full">
            {isActive && !isLoading && (
                <Box position="relative" height="full">
                    <VStack
                        as={motion.div}
                        animate={{ opacity: 1, transform: 'scale(1)', transition: { delay: 0.1 } }}
                        initial={{ opacity: 0, transform: 'scale(0.75)' }}
                        exit={{ opacity: 0, transform: 'scale(0.75)' }}
                        overflow="hidden"
                        height="full"
                        position="relative"
                    >
                        <Stack
                            divider={<StackDivider />}
                            width={{ base: '100%', lg: '60%' }}
                            height="full"
                            rounded="md"
                            background="whiteAlpha.200"
                            p="4"
                        >
                            <VStack spacing="0" h="50%" w="full" alignItems="flex-start">
                                <Box>
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="md" color="beets.base.50">
                                        Relic liquidity
                                    </Text>
                                    <Text color="white" fontSize="1.75rem">
                                        {numberFormatUSDValue(relicBalanceUSD)}
                                    </Text>
                                </Box>
                                <HStack spacing="1" mb="0.5">
                                    <TokenAvatar height="20px" width="20px" address={config.fbeets.address} />
                                    <Text fontSize="1rem" lineHeight="1rem">
                                        {tokenFormatAmount(selectedRelic?.amount || '0')}
                                    </Text>
                                </HStack>
                            </VStack>
                            <VStack spacing="0" h="50%" w="full" pt={{ base: '1', lg: undefined }}>
                                <VStack spacing="0" w="full" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="md" color="beets.base.50">
                                        Level up progress
                                    </Text>
                                    <VStack alignItems="flex-start" w="full">
                                        {!isMaxMaturity && (
                                            <HStack spacing="1" color="beets.green">
                                                <Text>Next level in</Text>
                                                <Countdown date={levelUpDate} />
                                            </HStack>
                                        )}
                                        {isMaxMaturity && (
                                            <BeetsTooltip noImage label="You've achieved the max level, nice!">
                                                <Box>
                                                    <Badge colorScheme="green">MAX LEVEL</Badge>
                                                </Box>
                                            </BeetsTooltip>
                                        )}
                                        <AnimatedProgress
                                            rounded="5"
                                            color="black"
                                            w="full"
                                            value={progressToNextLevel}
                                        />
                                    </VStack>
                                </VStack>

                                <HStack
                                    h="full"
                                    w="full"
                                    alignItems="flex-end"
                                    pt={{ base: '4', xl: '0' }}
                                    pb={{ base: '6', xl: '0' }}
                                >
                                    <Button
                                        variant="primary"
                                        w="full"
                                        size="md"
                                        rounded="lg"
                                        disabled={hasNoRelics}
                                        onClick={openInvestModal}
                                    >
                                        Deposit
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        w="full"
                                        size="md"
                                        rounded="lg"
                                        disabled={hasNoRelics}
                                        onClick={openWithdrawModal}
                                        zIndex={2}
                                    >
                                        Withdraw
                                    </Button>
                                </HStack>
                            </VStack>
                        </Stack>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}
