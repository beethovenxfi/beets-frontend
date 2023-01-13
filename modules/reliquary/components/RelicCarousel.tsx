import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { ReactNode, useEffect, useState } from 'react';
import { Pagination } from 'swiper';
import { Badge, Box, BoxProps, Heading, HStack, Image, Skeleton, VStack, Text, Flex } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { AnimatePresence, motion } from 'framer-motion';
import { ReliquaryFarmPosition, reliquaryService } from '~/lib/services/staking/reliquary.service';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import Countdown from 'react-countdown';
import RelicLevelUpButton from './RelicLevelUpButton';
import { useQuery } from 'react-query';
import { getProvider } from '@wagmi/core';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';

interface Props extends BoxProps {
    loading?: boolean;
}

interface RelicSlideProps {
    relic: ReliquaryFarmPosition;
    isNext: boolean;
    isActive: boolean;
}

function RelicSlide({ relic, isNext, isActive }: RelicSlideProps) {
    const swiper = useSwiper();
    const {
        maturityThresholds,
        selectedRelic,
        selectedRelicId,
        isLoadingRelicPositions,
        setSelectedRelicId,
        relicPositions,
    } = useReliquary();
    const { progressToNextLevel, levelUpDate, canUpgrade, canUpgradeTo } = relicGetMaturityProgress(
        selectedRelic,
        maturityThresholds,
    );

    const { data: nftURI = '' } = useQuery(['relicNFT', { selectedRelicId, isLoadingRelicPositions }], async () => {
        if (selectedRelicId) {
            return await reliquaryService.getRelicNFT({ tokenId: selectedRelicId, provider: getProvider() });
        }
    });

    const handleClick = (isNext: boolean) => {
        if (isActive) return;

        const relicPositionIndex = relicPositions.findIndex((position) => position.relicId === relic.relicId);

        if (isNext) {
            setSelectedRelicId(relicPositions[relicPositionIndex + 1].relicId);
            swiper.slideNext();
        } else {
            setSelectedRelicId(relicPositions[relicPositionIndex - 1].relicId);
            swiper.slidePrev();
        }
    };

    return (
        <AnimatePresence>
            <VStack
                onClick={() => handleClick(isNext)}
                as={motion.div}
                animate={{
                    opacity: isActive ? 1 : 0.35,
                    transform: isActive ? 'scale(1)' : 'scale(0.5)',
                    transition: { type: 'spring', mass: 0.1 },
                }}
                rounded="lg"
                spacing="8"
            >
                <Flex position="relative" className={isActive ? 'relic-glow' : ''} as={motion.div}>
                    {canUpgrade && isActive && (
                        <Flex
                            animate={{ opacity: 1, transition: { delay: 0.1 } }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            alignItems="center"
                            justifyContent="center"
                            rounded="lg"
                            width="full"
                            height="full"
                            position="absolute"
                            bg="blackAlpha.500"
                            as={motion.div}
                            zIndex={2}
                        >
                            <RelicLevelUpButton />
                        </Flex>
                    )}

                    <Box
                        filter="auto"
                        blur={isActive && canUpgrade ? '10px' : '0px'}
                        style={{ marginTop: '0 !important' }}
                        rounded="lg"
                        overflow="hidden"
                    >
                        <Image height="400px" width="400px" src={nftURI} />
                    </Box>
                </Flex>
                {isActive && (
                    <VStack
                        as={motion.div}
                        animate={{ opacity: 1, transform: 'scale(1)', transition: { delay: 0.3 } }}
                        initial={{ opacity: 0, transform: 'scale(0.75)' }}
                        exit={{ opacity: 0, transform: 'scale(0.75)' }}
                        overflow="hidden"
                        width="full"
                        position="relative"
                    >
                        <Box width="60%" rounded="lg" background="whiteAlpha.200" p="4">
                            <VStack spacing="3" width="full">
                                <VStack width="full" spacing="4">
                                    <VStack alignItems="flex-start" spacing="0" rounded="lg" width="full">
                                        <Heading textAlign="center" size="md">
                                            Level {relic?.level}: (Relic Level Name)
                                        </Heading>
                                        <Text>Relic ID - {relic?.relicId}</Text>
                                        <VStack spacing="1" width="full" alignItems="flex-start">
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
                                    <HStack width="full">
                                        <PoolInvestModal
                                            activatorLabel="Deposit"
                                            activatorProps={{ width: 'full', size: 'sm', rounded: 'lg' }}
                                        />
                                        <PoolWithdrawModal
                                            activatorProps={{ width: 'full', size: 'sm', rounded: 'lg' }}
                                        />
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>
                    </VStack>
                )}
            </VStack>
        </AnimatePresence>
    );
}

export function RelicCarousel({ loading, ...rest }: Props) {
    const { relicPositions, isLoadingRelicPositions, selectedRelic } = useReliquary();
    const [show, setShow] = useState<string | null>(null);

    function showDetailed(relicId: string) {
        setShow(relicId || null);
    }

    return (
        <Box
            sx={{
                '.swiper-pagination': {
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    bottom: -5,
                },
                '.swiper': {
                    paddingBottom: '6',
                    overflow: 'visible',
                },
                '.swiper-slide': {
                    transition: 'transform 300ms',
                },
                '.swiper-slide-next': {
                    transform: 'scale(1)',
                    opacity: '1',
                },
            }}
            {...rest}
            position="relative"
        >
            <Swiper
                slidesPerView={3}
                spaceBetween={-300}
                loop={relicPositions.length > 3}
                centeredSlides
                /*breakpoints={{
                    720: { slidesPerView: 3 },
                    992: { slidesPerView: 2 },
                    1124: { slidesPerView: 3 },
                }}*/
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
            >
                {relicPositions.map((relic) => (
                    <SwiperSlide key={`relic-carousel-${relic.relicId}`}>
                        {({ isActive, isNext }) => (
                            <RelicSlide
                                isNext={isNext}
                                isActive={isActive}
                                relic={selectedRelic || relicPositions[0]}
                            />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
