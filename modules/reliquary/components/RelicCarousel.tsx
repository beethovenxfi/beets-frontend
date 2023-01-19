import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode } from 'react';
import { Pagination } from 'swiper';
import { Box, BoxProps, Image, Skeleton } from '@chakra-ui/react';

interface Props extends BoxProps {
    items: ReactNode[];
    loading?: boolean;
    cardHeight?: string;
}

export function RelicCarousel({ items = [], loading, cardHeight = '500px', ...rest }: Props) {
    return (
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
        >
            <Swiper
                slidesPerView={3}
                spaceBetween={0}
                /*breakpoints={{
                    720: { slidesPerView: 3 },
                    992: { slidesPerView: 2 },
                    1124: { slidesPerView: 3 },
                }}*/
                pagination={{
                    //dynamicBullets: items.length > 8,
                    clickable: true,
                }}
                modules={[Pagination]}
            >
                <SwiperSlide key="1">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
                <SwiperSlide key="2">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
                <SwiperSlide key="3">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
                <SwiperSlide key="4">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
                <SwiperSlide key="5">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
                <SwiperSlide key="6">
                    <Image src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png" />
                </SwiperSlide>
            </Swiper>
        </Box>
    );
}
