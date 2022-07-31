import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode } from 'react';
import { Pagination } from 'swiper';
import { Box, BoxProps, Skeleton } from '@chakra-ui/react';

interface Props extends BoxProps {
    items: ReactNode[];
    loading?: boolean;
    cardHeight?: string;
}

export function PoolCardCarousel({ items, loading, cardHeight = '216px', ...rest }: Props) {
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
            }}
            {...rest}
        >
            <Swiper
                slidesPerView={2}
                spaceBetween={16}
                breakpoints={{
                    720: { slidesPerView: 3 },
                    992: { slidesPerView: 2 },
                    1124: { slidesPerView: 3 },
                }}
                pagination={{
                    //dynamicBullets: items.length > 8,
                    clickable: true,
                }}
                modules={[Pagination]}
            >
                {loading ? (
                    <>
                        <SwiperSlide key="1">
                            <Skeleton height={cardHeight} />
                        </SwiperSlide>
                        <SwiperSlide key="2">
                            <Skeleton height={cardHeight} />
                        </SwiperSlide>
                        <SwiperSlide key="3">
                            <Skeleton height={cardHeight} />
                        </SwiperSlide>
                    </>
                ) : (
                    items.map((item, index) => <SwiperSlide key={index}>{item}</SwiperSlide>)
                )}
            </Swiper>
        </Box>
    );
}
