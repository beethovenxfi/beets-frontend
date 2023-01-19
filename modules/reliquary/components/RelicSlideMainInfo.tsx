import { Box, Button, VStack, Text, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import Countdown from 'react-countdown';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useSwiper, useSwiperSlide } from 'swiper/react';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
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
    const swiper = useSwiper();
    const { data: relicTokenBalances, relicBalanceUSD } = useRelicDepositBalance();

    const { progressToNextLevel, levelUpDate, canUpgrade } = relicGetMaturityProgress(
        selectedRelic,
        maturityThresholds,
    );
    const hasNoRelics = relicPositions.length === 0;

    return (
        <Box height="full" width='full'>
            {isActive && !isLoading && (
                <Box position="relative" height="full">
                    {relicPositions.length > 1 && (
                        <Button
                            px="2"
                            zIndex={2}
                            position="absolute"
                            left="3rem"
                            top="50%"
                            transform="translateY(-50%)"
                            onClick={() => swiper.slidePrev()}
                        >
                            <ChevronLeft />
                        </Button>
                    )}

                    <VStack
                        as={motion.div}
                        animate={{ opacity: 1, transform: 'scale(1)', transition: { delay: 0.1 } }}
                        initial={{ opacity: 0, transform: 'scale(0.75)' }}
                        exit={{ opacity: 0, transform: 'scale(0.75)' }}
                        overflow="hidden"
                        width="full"
                        height="full"
                        position="relative"
                    >
                        <Box
                            width={{ base: '100%', lg: '60%' }}
                            height="full"
                            rounded="lg"
                            background="whiteAlpha.200"
                            p="4"
                        >
                            <VStack spacing="3" width="full" height="full">
                                <VStack width="full" spacing="4" height="full">
                                    <VStack
                                        alignItems="flex-start"
                                        justifyContent="space-between"
                                        rounded="lg"
                                        height="full"
                                        width="full"
                                    >
                                        <VStack
                                            width="full"
                                            spacing="5"
                                            // divider={<StackDivider />}
                                            alignItems="flex-start"
                                        >
                                            <Box>
                                                <Text
                                                    lineHeight="1rem"
                                                    fontWeight="semibold"
                                                    fontSize="md"
                                                    color="beets.base.50"
                                                >
                                                    Relic liquidity
                                                </Text>
                                                <Text color="white" fontSize="1.75rem">
                                                    {numberFormatUSDValue(relicBalanceUSD)}
                                                </Text>
                                            </Box>
                                            <VStack alignItems="flex-start">
                                                <Text
                                                    lineHeight="1rem"
                                                    fontWeight="semibold"
                                                    fontSize="md"
                                                    color="beets.base.50"
                                                >
                                                    fBeets Balance
                                                </Text>
                                                <TokenAmountPill
                                                    key={`relic-token-${config.fbeets.address}`}
                                                    address={config.fbeets.address}
                                                    amount={selectedRelic?.amount || '0'}
                                                />
                                                {/* <HStack spacing="1" display={{ base: 'block', md: 'flex' }}>
                                                    {relicTokenBalances &&
                                                        relicTokenBalances.map((token) => (
                                                            <TokenAmountPill
                                                                mt={{ base: '2', md: '0' }}
                                                                key={`relic-token-${token.address}`}
                                                                address={token.address}
                                                                amount={token.amount}
                                                            />
                                                        ))}
                                                </HStack> */}
                                            </VStack>
                                            <VStack spacing="2" width="full" alignItems="flex-start">
                                                <Text
                                                    lineHeight="1rem"
                                                    fontWeight="semibold"
                                                    fontSize="md"
                                                    color="beets.base.50"
                                                >
                                                    Relic progress
                                                </Text>
                                                <VStack spacing="1" alignItems="flex-start" width="full">
                                                    <HStack spacing="1" color="beets.green">
                                                        <Text>Next level in</Text>
                                                        <Countdown date={levelUpDate} />
                                                    </HStack>
                                                    <AnimatedProgress
                                                        rounded="none"
                                                        color="black"
                                                        width="full"
                                                        value={progressToNextLevel}
                                                    />
                                                </VStack>
                                            </VStack>
                                        </VStack>
                                    </VStack>
                                    <HStack width="full">
                                        <Button
                                            variant="primary"
                                            width="full"
                                            size="sm"
                                            rounded="lg"
                                            disabled={hasNoRelics}
                                            onClick={openInvestModal}
                                        >
                                            Deposit
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            width="full"
                                            size="sm"
                                            rounded="lg"
                                            disabled={hasNoRelics}
                                            onClick={openWithdrawModal}
                                            zIndex={2}
                                        >
                                            Withdraw
                                        </Button>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>
                    </VStack>

                    {relicPositions.length > 1 && (
                        <Button
                            px="2"
                            zIndex={2}
                            position="absolute"
                            right="3rem"
                            top="50%"
                            transform="translateY(-50%)"
                            onClick={() => swiper.slideNext()}
                        >
                            <ChevronRight />
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
