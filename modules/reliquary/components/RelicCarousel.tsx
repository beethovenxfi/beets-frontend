import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Pagination } from 'swiper';
import { Box, BoxProps, Heading, VStack, Flex, useBreakpointValue } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import RelicSlide from './RelicSlide';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';

interface Props extends BoxProps {
    loading?: boolean;
}

export function RelicCarousel({ loading, ...rest }: Props) {
    const { relicPositions, isLoadingRelicPositions, selectedRelic } = useReliquary();
    // hack to get around next.js hydration issues with swiper
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);

    const [isInvestModalVisible, setIsInvestModalVisible] = useState(false);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);

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
                        zIndex: -1,
                    },
                    '.swiper-slide-active': {
                        transform: 'scale(1)',
                        opacity: '1',
                        zIndex: 1,
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
                            <RelicSlide
                                openInvestModal={() => setIsInvestModalVisible(true)}
                                openWithdrawModal={() => setIsWithdrawModalVisible(true)}
                                relic={selectedRelic || relicPositions[0]}
                            />
                        </SwiperSlide>
                    ))}
                    {!relicPositions.length && (
                        <SwiperSlide key={`dummy-slide`}>
                            <RelicSlide
                                openInvestModal={() => setIsInvestModalVisible(true)}
                                openWithdrawModal={() => setIsWithdrawModalVisible(true)}
                                relic={selectedRelic || relicPositions[0]}
                            />
                        </SwiperSlide>
                    )}
                </Swiper>
            </Box>
            <PoolInvestModal
                onClose={() => setIsInvestModalVisible(false)}
                isVisible={isInvestModalVisible}
                noActivator
            />
            <PoolWithdrawModal
                onClose={() => setIsWithdrawModalVisible(false)}
                isVisible={isWithdrawModalVisible}
                noActivator
            />
        </Box>
    );
}
