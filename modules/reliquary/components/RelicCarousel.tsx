import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode, useState } from 'react';
import { Pagination } from 'swiper';
import { Badge, Box, BoxProps, Heading, HStack, Image, Skeleton, VStack, Text } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { RelicStats } from './RelicStats';

interface Props extends BoxProps {
    items: ReactNode[];
    loading?: boolean;
    cardHeight?: string;
}

function SelectedRelic({ relicId }: any) {
    return (
        <Box
            position="absolute"
            height="full"
            top="0"
            left="0"
            right="0"
            bg="gray.600"
            zIndex={2}
            width="75%"
            mx="auto"
            rounded="md"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <HStack>
                <HStack layoutId={`image-${relicId}`} as={motion.div} width="50%" height="100%">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </HStack>
                <Box width="50%" overflow="scroll" height="400px">
                    <RelicStats />
                </Box>
            </HStack>
        </Box>
    );
}

export function RelicCarousel({ items = [], loading, cardHeight = '500px', ...rest }: Props) {
    const { relicPositions } = useReliquary();
    const [show, setShow] = useState<string | null>(null);

    function showDetailed(relicId: string) {
        setShow(relicId || null);
    }
    return (
        <AnimateSharedLayout>
            <Box
                sx={{
                    '.swiper-pagination': {
                        bottom: '0px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                    },
                    '.swiper': {
                        paddingBottom: '6',
                        //overflowY: 'visible',
                    },
                    '.swiper-slide': {
                        transform: 'scale(0.7)',
                        transition: 'transform 300ms',
                        opacity: '0.4',
                    },
                    '.swiper-slide-next': {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                }}
                {...rest}
                position="relative"
            >
                {show && <SelectedRelic relicId={show} />}
                <Swiper
                    slidesPerView={3}
                    spaceBetween={0}
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
                    {relicPositions.map((relic) => {
                        return (
                            <SwiperSlide key={`relic-carousel-${relic.relicId}`}>
                                <VStack as={motion.div} bg="blackAlpha.400" rounded="lg" overflow="hidden">
                                    <VStack px="4" pb="2" pt="4" width="full">
                                        <HStack width="full" justifyContent="center" alignItems="flex-start">
                                            {/* <Heading size="md">{relic.relicId}</Heading> */}
                                            <Badge rounded="md" colorScheme="blue" py="1" px="2">
                                                Relic #{relic.level + 1} | Level {relic.level + 1}
                                            </Badge>
                                            <Badge rounded="md" colorScheme="green" py="1" px="2">
                                                40% APR
                                            </Badge>
                                        </HStack>
                                    </VStack>
                                    <Box as={motion.div} layoutId={`image-${relic.relicId}`}>
                                        <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                                    </Box>
                                </VStack>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Box>
        </AnimateSharedLayout>
    );
}
