import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode } from 'react';
import { Pagination } from 'swiper';
import { Box, BoxProps } from '@chakra-ui/react';

interface Props extends BoxProps {
    items: ReactNode[];
}

export function PoolCardCarousel({ items, ...rest }: Props) {
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
                },
            }}
            {...rest}
        >
            <Swiper
                slidesPerView={2}
                spaceBetween={16}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    992: { slidesPerView: 2 },
                    1124: { slidesPerView: 3 },
                }}
                pagination={{
                    //dynamicBullets: true,
                    clickable: true,
                }}
                modules={[Pagination]}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>{item}</SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
