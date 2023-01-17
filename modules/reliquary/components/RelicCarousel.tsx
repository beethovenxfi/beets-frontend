import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { ReactNode, useEffect, useState } from 'react';
import { Pagination } from 'swiper';
import {
    Badge,
    Box,
    BoxProps,
    Heading,
    HStack,
    Image,
    Skeleton,
    VStack,
    Text,
    Flex,
    Button,
    useBreakpointValue,
    Tooltip,
} from '@chakra-ui/react';
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
import { ChevronLeft, ChevronRight } from 'react-feather';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useBatchRelayerHasRelicApproval } from '../lib/useBatchRelayerHasRelicApproval';
import { ReliquaryBatchRelayerApprovalButton } from './ReliquaryBatchRelayerApprovalButton';

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
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    const hasNoRelics = relicPositions.length === 0;
    const { data: batchRelayerHasRelicApproval, refetch } = useBatchRelayerHasRelicApproval(
        parseInt(selectedRelicId || ''),
    );

    const { data: nftURI = '' } = useQuery(['relicNFT', { selectedRelicId, isLoadingRelicPositions }], async () => {
        if (!_isLoadingRelicPositions && hasNoRelics) {
            return 'https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png';
        }
        if (selectedRelicId) {
            return await reliquaryService.getRelicNFT({ tokenId: selectedRelicId, provider: getProvider() });
        }
    });

    const handleClick = (isNext: boolean) => {
        const relicPositionIndex = relicPositions.findIndex((position) => position.relicId === relic.relicId);

        if (isNext) {
            setSelectedRelicId(relicPositions[relicPositionIndex + 1].relicId);
            swiper.slideNext();
        } else {
            setSelectedRelicId(relicPositions[relicPositionIndex - 1].relicId);
            swiper.slidePrev();
        }
    };

    function getContainerOpacity() {
        if (hasNoRelics) {
            return 0.25;
        }
        if (isActive) {
            return 1;
        } else {
            return 0.35;
        }
    }

    function getUnderglowClass() {
        if (true) return '';
        if (isActive) {
            return 'relic-glow';
        }
        return '';
    }

    useEffect(() => {}, [isActive]);

    return (
        <AnimatePresence>
            <VStack
                filter="auto"
                blur={hasNoRelics ? '10px' : '0'}
                as={motion.div}
                animate={{
                    opacity: getContainerOpacity(),
                    transform: isActive ? 'scale(1)' : 'scale(0.5)',
                    transition: { type: 'spring', mass: 0.1 },
                }}
                rounded="lg"
                spacing="8"
            >
                <Flex position="relative" className={getUnderglowClass()} as={motion.div}>
                    {canUpgrade && isActive && (
                        <Flex
                            animate={{ opacity: 1 }}
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
                        blur={isActive && canUpgrade && !_isLoadingRelicPositions ? '10px' : '0px'}
                        style={{ marginTop: '0 !important' }}
                        rounded="lg"
                        overflow="hidden"
                    >
                        {_isLoadingRelicPositions && (
                            <Skeleton>
                                <Image height="400px" width="400px" src={nftURI} />
                            </Skeleton>
                        )}
                        {!_isLoadingRelicPositions && <Image height="400px" width="400px" src={nftURI} />}
                    </Box>
                </Flex>
                {isActive && !_isLoadingRelicPositions && (
                    <Box position="relative" width="full">
                        {relicPositions.length > 1 && (
                            <Button
                                px="2"
                                zIndex={2}
                                position="absolute"
                                left="3rem"
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={() => handleClick(false)}
                                isDisabled={
                                    relicPositions.findIndex((position) => position.relicId === relic.relicId) === 0
                                }
                            >
                                <ChevronLeft />
                            </Button>
                        )}
                        <VStack
                            as={motion.div}
                            animate={{ opacity: 1, transform: 'scale(1)' }}
                            initial={{ opacity: 0, transform: 'scale(0.75)' }}
                            exit={{ opacity: 0, transform: 'scale(0.75)' }}
                            overflow="hidden"
                            width="full"
                            position="relative"
                        >
                            <Box width={{ base: '100%', lg: '60%' }} rounded="lg" background="whiteAlpha.200" p="4">
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
                                                activatorProps={{
                                                    width: 'full',
                                                    size: 'sm',
                                                    rounded: 'lg',
                                                    disabled: hasNoRelics,
                                                }}
                                            />
                                            <PoolWithdrawModal
                                                activatorProps={{
                                                    width: 'full',
                                                    size: 'sm',
                                                    rounded: 'lg',
                                                    disabled: hasNoRelics,
                                                }}
                                            />
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
                                onClick={() => handleClick(true)}
                                isDisabled={
                                    relicPositions.findIndex((position) => position.relicId === relic.relicId) ===
                                    relicPositions.length - 1
                                }
                            >
                                <ChevronRight />
                            </Button>
                        )}
                    </Box>
                )}
            </VStack>
        </AnimatePresence>
    );
}

export function RelicCarousel({ loading, ...rest }: Props) {
    const { relicPositions, isLoadingRelicPositions, selectedRelic } = useReliquary();
    // hack to get around next.js hydration issues with swiper
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const hasNoRelics = relicPositions.length === 0;

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);
    return (
        <Box position="relative" minH="600px">
            {hasNoRelics && !_isLoadingRelicPositions && (
                <Flex justifyContent="center" zIndex={2} width="full" position="absolute" left="0" right="0" top="30%">
                    <VStack spacing="4" alignItems="center">
                        <Heading size="md">Get started by minting your own relic</Heading>
                        <Box>
                            <PoolInvestModal createRelic activatorProps={{ size: 'lg', width: '200px', mx: 'auto' }} />
                        </Box>
                    </VStack>
                </Flex>
            )}
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
                    loop={relicPositions.length > 1}
                    centeredSlides
                    /*breakpoints={{
                    720: { slidesPerView: 3 },
                    992: { slidesPerView: 2 },
                    1124: { slidesPerView: 3 },
                }}*/
                    pagination={{
                        clickable: true,
                    }}
                    allowTouchMove={isMobile}
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
                    {!relicPositions.length && (
                        <SwiperSlide key={`dummy-slide`}>
                            {({ isActive, isNext }) => (
                                <RelicSlide
                                    isNext={isNext}
                                    isActive={isActive}
                                    relic={selectedRelic || relicPositions[0]}
                                />
                            )}
                        </SwiperSlide>
                    )}
                </Swiper>
            </Box>
        </Box>
    );
}
